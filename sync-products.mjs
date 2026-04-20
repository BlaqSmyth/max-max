/**
 * Sync all EPOS products to Supabase with the new EPOS-native category slugs.
 * Run from Replit: node sync-products.mjs
 */

const EPOS_HOST = "http://86.29.20.217/MAXAPI";
const EPOS_AUTH = "Basic " + Buffer.from("test:test").toString("base64");

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
  process.exit(1);
}

// ── Category slug logic (mirrors server/eposService.ts) ──────────────────────

const MISC_CATEGORIES = new Set([
  "MILK TOKEN", "MEAT SCALE", "BUTCHER WEIGHT", "OYSTER CARD",
  "PAY POINT", "CALLING CARD", "LOTTERY", "HOT PRODUCTS", "Scratch Card",
  "SCRATCH CARD", "Misc",
]);

const SLUG_OVERRIDES = {
  "FRUIT & VEGETABLES": "fruit-veg",
  "FRUIT VEG":          "fruit-veg",
  "FRUITS":             "fruit-veg",
  "SOFTDRINKS":         "soft-drinks",
  "FROZEN FOODS":       "frozen-foods",
  "FROZEN FISH":        "frozen-fish",
  "ARABIC GROCERY":     "arabic-grocery",
  "DRY FOODS":          "dry-foods",
  "CAN FOODS":          "canned-foods",
  "SWEET AND DESSERT":  "sweets-desserts",
  "HEALTH & BEAUTY":    "health-beauty",
  "CONFECTIONERRY":     "confectionery",
  "FLAVOURED WATER":    "flavoured-water",
  "MEDICIN/SYRUP":      "medicine",
  "TIN FISH":           "tin-fish",
  "TIN MILK":           "dairy",
  "WOOD COAL":          "charcoal",
  "BABY CARE":          "baby-care",
  "BABY FOOD":          "baby-food",
  "ICE CREAMS":         "ice-cream",
  "SANDWICHES":         "bakery",
  "NUTS":               "nuts-dried-fruits",
  "DATES":              "nuts-dried-fruits",
  "Health Products":    "health-products",
};

function toEposSlug(cat) {
  const trimmed = cat.trim();
  if (MISC_CATEGORIES.has(trimmed)) return "misc";
  if (SLUG_OVERRIDES[trimmed]) return SLUG_OVERRIDES[trimmed];
  return trimmed
    .toLowerCase()
    .replace(/[&/]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapCategory(product) {
  const primary = product.Category_Name1?.trim();
  if (primary) return toEposSlug(primary);
  const fallback = product.Category_Name2?.trim() || product.subcategoryname?.trim();
  if (fallback) return toEposSlug(fallback);
  return "misc";
}

// ── Fetch from EPOS ──────────────────────────────────────────────────────────

async function fetchEposProducts() {
  console.log("Fetching products from EPOS...");
  const res = await fetch(`${EPOS_HOST}/api/values?modifiedDate=2000-01-01`, {
    headers: { Authorization: EPOS_AUTH, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`EPOS error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  console.log(`  Fetched ${data.length} products from EPOS`);
  return Array.isArray(data) ? data : [];
}

// ── Upsert to Supabase ───────────────────────────────────────────────────────

async function upsertBatch(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase upsert error ${res.status}: ${txt}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const eposProducts = await fetchEposProducts();

  // Fetch existing product images so we don't overwrite custom ones
  console.log("Fetching existing product images from Supabase...");
  const existingImages = {};
  let imgOffset = 0;
  while (true) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,image&limit=1000&offset=${imgOffset}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const data = await r.json();
    if (!Array.isArray(data) || data.length === 0) break;
    data.forEach(p => { if (p.image) existingImages[p.id] = p.image; });
    if (data.length < 1000) break;
    imgOffset += 1000;
  }
  console.log(`  Found images for ${Object.keys(existingImages).length} existing products`);

  // Convert to our product schema
  const rows = eposProducts
    .filter(p => p.Central_Product_Code && !p.Is_Deleted)
    .map(p => {
      const price = parseFloat(p.SellingPrice) || 0;
      const stock = typeof p.Physical_Qty === "number" ? p.Physical_Qty : 0;
      const id = `epos-${p.Central_Product_Code}`;
      // Preserve any existing custom image; only use placeholder for new products
      const image = existingImages[id] || "/placeholder-product.png";
      return {
        id,
        name: p.Product_Name || p.SupplierProductDescription || "Unknown Product",
        description: p.Product_Description || null,
        category: mapCategory(p),
        price: price.toFixed(2),
        member_price: null,
        image,
        in_stock: stock > 0 ? 1 : 0,
      };
    });

  console.log(`\nConverted ${rows.length} products`);

  // Show category breakdown
  const cats = {};
  rows.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
  const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  console.log("\nCategory breakdown:");
  sorted.forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

  // Upsert in chunks of 500
  const CHUNK = 500;
  let done = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await upsertBatch(chunk);
    done += chunk.length;
    console.log(`\nUploaded ${done}/${rows.length}...`);
  }

  console.log("\nSync complete!");
}

main().catch(err => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
