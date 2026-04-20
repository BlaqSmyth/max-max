const EPOS_HOST = process.env.EPOS_HOST || "http://86.29.20.217/MAXAPI";
const EPOS_USERNAME = process.env.EPOS_USERNAME || "test";
const EPOS_PASSWORD = process.env.EPOS_PASSWORD || "test";

function getAuthHeader(): string {
  const encoded = Buffer.from(`${EPOS_USERNAME}:${EPOS_PASSWORD}`).toString("base64");
  return `Basic ${encoded}`;
}

export interface EposProduct {
  Category_Name1: string;
  Category_Name2: string;
  Category_Name3: string;
  Category_Name4: string;
  UnitOfProduct: string;
  SupplierProductCode: string;
  SupplierProductDescription: string;
  SupplierName: string;
  Central_Product_Code: string;
  Product_Name: string;
  Product_Description: string;
  Cost_Price: number;
  SellingPrice: string;
  Stock_Max_Level: number;
  Physical_Qty: number;
  BackOrder_Qty: number;
  Is_Deleted: boolean;
  CreatedDateTime: string;
  ModifiedDateTime: string;
  Vat_Percentage: number;
  HasExpiry: boolean;
  Br_Code: string;
  subcategoryname: string;
}

export interface EposStockItem {
  ProductCode: string;
  StockCount: string;
}

export interface EposSalePayload {
  Sales: {
    Order_Id: number;
    Order_date: string;
    Customer_name: string;
    Customer_Lastname: string;
    HouseNo: string;
    Road: string;
    City: string;
    County: string;
    Postcode: string;
    CountryName: string;
    Delivery_HouseNo: string;
    Delivery_Road: string;
    Delivery_City: string;
    Delivery_County: string;
    Delivery_Postcode: string;
    Delivery_Country: string;
    Phone: string;
    Email: string;
    GrandTotal: string;
    Delivery_Cost: string;
    Vat_Cost: string;
    NumberOfItems: string;
    WebOrder_Ref: string;
  };
  Sales_Details: {
    ItemID: string;
    Quantity: number;
    Product_Name: string;
    UnitPrice: string;
    TotalPrice: string;
    VatPercentage: string;
    DiscountValue: string;
  }[];
  Payments: {
    Paidby: string;
    Amount: string;
  };
}

// Service/till items that are not real products — mapped to "misc" and hidden from the website
const MISC_CATEGORIES = new Set([
  "MILK TOKEN", "MEAT SCALE", "BUTCHER WEIGHT", "OYSTER CARD",
  "PAY POINT", "CALLING CARD", "LOTTERY", "HOT PRODUCTS", "Scratch Card",
  "SCRATCH CARD", "Misc",
]);

// Explicit overrides where the EPOS name needs normalising to a canonical slug
const SLUG_OVERRIDES: Record<string, string> = {
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

function toEposSlug(cat: string): string {
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

export function mapEposCategory(product: EposProduct): string {
  const primary = product.Category_Name1?.trim();
  if (primary) return toEposSlug(primary);
  const fallback = product.Category_Name2?.trim() || product.subcategoryname?.trim();
  if (fallback) return toEposSlug(fallback);
  return "misc";
}

export async function fetchEposProducts(modifiedDate?: string): Promise<EposProduct[]> {
  const date = modifiedDate || "2000-01-01";
  const url = `${EPOS_HOST}/api/values?modifiedDate=${date}`;

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EPOS Products API error ${response.status}: ${text}`);
  }

  const data = await response.json() as EposProduct[];
  return Array.isArray(data) ? data : [];
}

export async function fetchEposStock(): Promise<EposStockItem[]> {
  const url = `${EPOS_HOST}/api/Stock`;

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EPOS Stock API error ${response.status}: ${text}`);
  }

  const data = await response.json() as EposStockItem[];
  return Array.isArray(data) ? data : [];
}

export async function postEposSale(payload: EposSalePayload): Promise<{ Order_Id: number; Status: string; Reason: string; WebOrderRef: string }[]> {
  const url = `${EPOS_HOST}/api/Sales`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EPOS Sales API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<any[]>;
}

export function testEposConnection(): Promise<boolean> {
  return fetchEposProducts("2000-01-01")
    .then(() => true)
    .catch(() => false);
}
