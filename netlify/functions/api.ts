import { db } from "../../server/db";
import { products, insertProductSchema } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { seedProducts } from "../../server/seedProducts";
import { adminAuthService, verifyAdminPassword } from "../../server/adminAuth";
import { uploadFileToSupabase, isSupabaseConfigured } from "../../server/supabaseStorage";
import { randomUUID } from "crypto";
import { parse as parseCsv } from "csv-parse/sync";

let seeded = false;

function getPath(event: any): string {
  if (event.rawUrl) {
    try {
      return new URL(event.rawUrl).pathname;
    } catch {}
  }
  return event.path || "/";
}

function getBody(event: any): any {
  try {
    if (!event.body) return {};
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function json(data: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data),
  };
}

function adminCheck(event: any): boolean {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return false;
  return adminAuthService.validateToken(auth.slice(7));
}

export const handler = async (event: any, _context: any) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: "",
    };
  }

  const path = getPath(event);
  const method = event.httpMethod;

  try {
    // Seed on first invocation
    if (!seeded) {
      try { await seedProducts(); } catch {}
      seeded = true;
    }

    // Health check
    if (path === "/api/health") {
      return json({ status: "ok", hasDb: !!process.env.DATABASE_URL });
    }

    // GET /api/products
    if (path === "/api/products" && method === "GET") {
      const all = await db.select().from(products);
      return json(all);
    }

    // GET /api/products/:id
    const productIdMatch = path.match(/^\/api\/products\/([^\/]+)$/);
    if (productIdMatch && method === "GET") {
      const [product] = await db.select().from(products).where(eq(products.id, productIdMatch[1]));
      if (!product) return json({ error: "Not found" }, 404);
      return json(product);
    }

    // POST /api/admin/login
    if (path === "/api/admin/login" && method === "POST") {
      const { password } = getBody(event);
      if (!password || !verifyAdminPassword(password)) {
        return json({ error: "Invalid password" }, 401);
      }
      const token = adminAuthService.createSession();
      return json({ token });
    }

    // POST /api/admin/logout
    if (path === "/api/admin/logout" && method === "POST") {
      const auth = (event.headers?.authorization || event.headers?.Authorization || "");
      if (auth.startsWith("Bearer ")) adminAuthService.revokeToken(auth.slice(7));
      return { statusCode: 204, body: "" };
    }

    // GET /api/admin/status
    if (path === "/api/admin/status" && method === "GET") {
      return json({ authenticated: adminCheck(event) });
    }

    // POST /api/products (create) — admin
    if (path === "/api/products" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const body = getBody(event);
      const parsed = insertProductSchema.safeParse(body);
      if (!parsed.success) return json({ error: parsed.error.errors }, 400);
      const id = randomUUID();
      const [created] = await db.insert(products).values({ id, ...parsed.data }).returning();
      return json(created, 201);
    }

    // PUT /api/products/:id (update) — admin
    const updateMatch = path.match(/^\/api\/products\/([^\/]+)$/);
    if (updateMatch && method === "PUT") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const body = getBody(event);
      const [updated] = await db
        .update(products)
        .set(body)
        .where(eq(products.id, updateMatch[1]))
        .returning();
      if (!updated) return json({ error: "Not found" }, 404);
      return json(updated);
    }

    // DELETE /api/products/:id — admin
    const deleteMatch = path.match(/^\/api\/products\/([^\/]+)$/);
    if (deleteMatch && method === "DELETE") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const deleted = await db.delete(products).where(eq(products.id, deleteMatch[1])).returning();
      if (!deleted.length) return json({ error: "Not found" }, 404);
      return { statusCode: 204, body: "" };
    }

    // POST /api/products/upload-image — admin
    if (path === "/api/products/upload-image" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      if (!isSupabaseConfigured()) return json({ error: "Supabase not configured" }, 503);

      const contentType = event.headers?.["content-type"] || event.headers?.["Content-Type"] || "";
      const buffer = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : Buffer.from(event.body || "", "utf-8");

      const imageUrl = await uploadFileToSupabase(buffer, contentType.split(";")[0] || "image/jpeg");
      return json({ url: imageUrl });
    }

    // POST /api/products/bulk-upload — admin (CSV or ZIP)
    if (path === "/api/products/bulk-upload" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const contentType = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").toLowerCase();
      const buffer = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : Buffer.from(event.body || "", "utf-8");

      if (contentType.includes("text/csv") || contentType.includes("application/csv")) {
        const records = parseCsv(buffer.toString("utf-8"), { columns: true, skip_empty_lines: true });
        const created: any[] = [];
        for (const row of records) {
          const id = randomUUID();
          const parsed = insertProductSchema.safeParse({
            name: row.name,
            description: row.description || null,
            category: row.category,
            price: row.price,
            memberPrice: row.memberPrice || null,
            image: row.image || "/attached_assets/placeholder.png",
            inStock: row.inStock !== undefined ? Number(row.inStock) : 1,
          });
          if (parsed.success) {
            const [p] = await db.insert(products).values({ id, ...parsed.data }).returning();
            created.push(p);
          }
        }
        return json({ created: created.length, products: created });
      }

      return json({ error: "Unsupported content type" }, 400);
    }

    return json({ error: "Not found" }, 404);
  } catch (err: any) {
    console.error("[api] Error:", err?.message, err?.stack);
    return json({ error: "Internal server error", detail: err?.message }, 500);
  }
};
