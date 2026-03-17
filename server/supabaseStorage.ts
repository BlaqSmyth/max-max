import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
  return createClient(url, key);
}

const BUCKET = "product-images";

function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };
  return map[mimeType] || ".jpg";
}

export async function uploadFileToSupabase(buffer: Buffer, contentType: string): Promise<string> {
  const supabase = getSupabaseClient();
  const ext = getExtensionFromMimeType(contentType);
  const filename = `products/${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType, upsert: false });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}
