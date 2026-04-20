import { fetchEposProducts, mapEposCategory } from "./eposService";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_KEY || "").trim();

const STATUS_BUCKET = "product-images";
const STATUS_PATH = "metadata/sync-status.json";

export interface SyncTypeStatus {
  status: "idle" | "pending" | "running" | "ok" | "error";
  last_run: string | null;
  count: number;
  error: string | null;
  requested: boolean;
  schedule: string;
}

export interface SyncStatusFile {
  products: SyncTypeStatus;
  stock: SyncTypeStatus;
}

const DEFAULT: SyncStatusFile = {
  products: { status: "idle", last_run: null, count: 0, error: null, requested: false, schedule: "every 24 hours" },
  stock:    { status: "idle", last_run: null, count: 0, error: null, requested: false, schedule: "every hour" },
};

export async function readSyncStatus(): Promise<SyncStatusFile> {
  try {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${STATUS_BUCKET}/${STATUS_PATH}`;
    const res = await fetch(url, { cache: "no-store" } as any);
    if (!res.ok) return { ...DEFAULT };
    return await res.json();
  } catch {
    return { ...DEFAULT };
  }
}

export async function writeSyncStatus(s: SyncStatusFile): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${STATUS_BUCKET}/${STATUS_PATH}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "x-upsert": "true",
      },
      body: JSON.stringify(s, null, 2),
    });
  } catch (e: any) {
    console.error("[sync] Failed to write status:", e.message);
  }
}

async function fetchExistingImages(): Promise<Record<string, string>> {
  const images: Record<string, string> = {};
  let offset = 0;
  while (true) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,image&limit=1000&offset=${offset}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) break;
    data.forEach((p: any) => { if (p.image) images[p.id] = p.image; });
    if (data.length < 1000) break;
    offset += 1000;
  }
  return images;
}

async function upsertBatch(rows: any[]) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!r.ok) throw new Error(`Supabase upsert error ${r.status}: ${await r.text()}`);
}

async function runProductSync(s: SyncStatusFile): Promise<void> {
  console.log("[sync] Starting product sync...");
  s.products.status = "running";
  await writeSyncStatus(s);

  const [eposProducts, existingImages] = await Promise.all([
    fetchEposProducts(),
    fetchExistingImages(),
  ]);

  const rows = eposProducts
    .filter((p: any) => p.Central_Product_Code && !p.Is_Deleted)
    .map((p: any) => {
      const price = parseFloat(p.SellingPrice) || 0;
      const stock = typeof p.Physical_Qty === "number" ? p.Physical_Qty : 0;
      const id = `epos-${p.Central_Product_Code}`;
      return {
        id,
        name: p.Product_Name || p.SupplierProductDescription || "Unknown Product",
        description: p.Product_Description || null,
        category: mapEposCategory(p),
        price: price.toFixed(2),
        member_price: null,
        image: existingImages[id] || "/placeholder-product.png",
        in_stock: stock > 0 ? 1 : 0,
      };
    });

  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await upsertBatch(rows.slice(i, i + CHUNK));
  }

  s.products.status = "ok";
  s.products.last_run = new Date().toISOString();
  s.products.count = rows.length;
  s.products.error = null;
  s.products.requested = false;
  console.log(`[sync] Product sync done: ${rows.length} products`);
}

async function runStockSync(s: SyncStatusFile): Promise<void> {
  console.log("[sync] Starting stock sync...");
  s.stock.status = "running";
  await writeSyncStatus(s);

  const [eposProducts, existingImages] = await Promise.all([
    fetchEposProducts(),
    fetchExistingImages(),
  ]);

  const existingIds = new Set(Object.keys(existingImages));

  const rows = eposProducts
    .filter((p: any) => {
      if (!p.Central_Product_Code) return false;
      const id = `epos-${p.Central_Product_Code}`;
      return existingIds.has(id); // only update products already in the database
    })
    .map((p: any) => {
      const price = parseFloat(p.SellingPrice) || 0;
      const stock = typeof p.Physical_Qty === "number" ? p.Physical_Qty : 0;
      const id = `epos-${p.Central_Product_Code}`;
      return {
        id,
        name: p.Product_Name || p.SupplierProductDescription || "Unknown Product",
        category: mapEposCategory(p) || "misc",
        price: price.toFixed(2),
        image: existingImages[id] || "/placeholder-product.png",
        in_stock: stock > 0 ? 1 : 0,
      };
    });

  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await upsertBatch(rows.slice(i, i + CHUNK));
  }

  s.stock.status = "ok";
  s.stock.last_run = new Date().toISOString();
  s.stock.count = rows.length;
  s.stock.error = null;
  s.stock.requested = false;
  console.log(`[sync] Stock sync done: ${rows.length} products updated`);
}

const PRODUCT_INTERVAL = 24 * 60 * 60 * 1000;
const STOCK_INTERVAL   =      60 * 60 * 1000;

let lastProductSync = 0;
let lastStockSync   = 0;

async function tick() {
  const now = Date.now();
  const s = await readSyncStatus();
  let changed = false;

  const doProducts = s.products.requested || (now - lastProductSync >= PRODUCT_INTERVAL);
  const doStock    = s.stock.requested    || (now - lastStockSync   >= STOCK_INTERVAL);

  if (doProducts && s.products.status !== "running") {
    try {
      await runProductSync(s);
      lastProductSync = now;
    } catch (e: any) {
      s.products.status = "error";
      s.products.error = e.message;
      s.products.requested = false;
      console.error("[sync] Product sync error:", e.message);
    }
    changed = true;
  }

  if (doStock && s.stock.status !== "running") {
    try {
      await runStockSync(s);
    } catch (e: any) {
      s.stock.status = "error";
      s.stock.error = e.message;
      s.stock.requested = false;
      console.error("[sync] Stock sync error:", e.message);
    }
    lastStockSync = now; // always update so we don't retry every minute on failure
    changed = true;
  }

  if (changed) await writeSyncStatus(s);
}

export function startSyncScheduler() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("[sync] Supabase not configured — scheduler disabled");
    return;
  }
  console.log("[sync] Scheduler started (products: 24h, stock: 1h)");
  setTimeout(tick, 10_000);
  setInterval(tick, 60_000);
}
