/**
 * Migration script: Replit DB + Replit Object Storage → Supabase DB + Supabase Storage
 * Run with: npx tsx scripts/migrate-to-supabase.ts
 */

import { neon } from "@neondatabase/serverless";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { ObjectStorageService } from "../server/objectStorage";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const BUCKET = "product-images";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL!);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const objectStorage = new ObjectStorageService();

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png",
    "image/gif": ".gif", "image/webp": ".webp",
  };
  return map[mimeType] || ".jpg";
}

function mimeFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  return { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[ext] || "image/jpeg";
}

async function downloadFromObjectStorage(imagePath: string): Promise<Buffer | null> {
  // imagePath is like /public-objects/products/uuid.jpg
  // Strip the /public-objects/ prefix to get the search path
  const stripped = imagePath.replace(/^\/public-objects\//, "");
  try {
    const file = await objectStorage.searchPublicObject(stripped);
    if (!file) { console.log("  File not found in object storage:", stripped); return null; }
    const [contents] = await file.download();
    return contents as Buffer;
  } catch (err: any) {
    console.log("  Download error for", stripped, ":", err.message);
    return null;
  }
}

async function uploadToSupabase(buffer: Buffer, mimeType: string): Promise<string> {
  const ext = getExtension(mimeType);
  const filename = `products/${randomUUID()}${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, { contentType: mimeType, upsert: false });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

async function main() {
  console.log("=== Max & Max Migration: Replit → Supabase ===\n");

  // 1. Fetch all products from Replit database
  console.log("1. Fetching products from Replit database...");
  const products = await sql`
    SELECT id, name, description, category, price, "memberPrice" as member_price, image, "inStock" as in_stock
    FROM products
    ORDER BY name
  `;
  console.log(`   Found ${products.length} products\n`);

  // 2. Clear existing products from Supabase (the bad seed data)
  console.log("2. Clearing existing Supabase products...");
  const { error: deleteError } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) { console.error("   Delete error:", deleteError.message); process.exit(1); }
  console.log("   Cleared.\n");

  // 3. Migrate each product
  console.log("3. Migrating products...");
  let imagesMigrated = 0;
  let imagesFailed = 0;
  const rows: any[] = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    process.stdout.write(`   [${i + 1}/${products.length}] ${p.name} ... `);

    let imageUrl = p.image as string;

    // If image is in Replit Object Storage, migrate it to Supabase Storage
    if (imageUrl && imageUrl.startsWith("/public-objects/")) {
      const mimeType = mimeFromPath(imageUrl);
      const buffer = await downloadFromObjectStorage(imageUrl);
      if (buffer) {
        try {
          imageUrl = await uploadToSupabase(buffer, mimeType);
          imagesMigrated++;
          process.stdout.write(`image migrated ✓\n`);
        } catch (err: any) {
          console.log(`image upload failed: ${err.message}`);
          imagesFailed++;
          imageUrl = ""; // blank so frontend shows placeholder
        }
      } else {
        process.stdout.write(`image not found\n`);
        imagesFailed++;
        imageUrl = "";
      }
    } else {
      process.stdout.write(`(no image to migrate)\n`);
    }

    rows.push({
      id: p.id,
      name: p.name,
      description: p.description || null,
      category: p.category,
      price: p.price,
      member_price: p.member_price || null,
      image: imageUrl || "",
      in_stock: p.in_stock ?? 1,
    });
  }

  // 4. Insert all products into Supabase in batches of 50
  console.log("\n4. Inserting products into Supabase...");
  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("products").insert(batch);
    if (error) { console.error("   Insert error:", error.message, error.details); process.exit(1); }
    console.log(`   Inserted ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
  }

  // 5. Verify
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
  console.log(`\n=== Migration complete ===`);
  console.log(`Products in Supabase: ${count}`);
  console.log(`Images migrated: ${imagesMigrated}`);
  console.log(`Images failed/not found: ${imagesFailed}`);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
