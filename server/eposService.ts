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

// Map EPOS category names to our website category IDs
const CATEGORY_MAP: Record<string, string> = {
  // Alcohol
  "WINES SPIRITS BEERS": "alcohol",
  "WINE": "alcohol",
  "WINES": "alcohol",
  "BEER": "alcohol",
  "BEERS": "alcohol",
  "SPIRITS": "alcohol",
  "ALCOHOL": "alcohol",
  "LAGER": "alcohol",
  "ALE": "alcohol",
  "CIDER": "alcohol",
  // Produce
  "PRODUCE": "produce",
  "FRESH PRODUCE": "produce",
  "FRUIT & VEG": "produce",
  "FRUIT AND VEG": "produce",
  "FRUIT": "produce",
  "VEGETABLES": "produce",
  "VEG": "produce",
  "SALAD": "produce",
  // Bakery
  "BAKERY": "bakery",
  "BREAD": "bakery",
  "CAKES": "bakery",
  "PASTRIES": "bakery",
  // Dairy & Chilled
  "DAIRY": "dairy",
  "CHILLED": "dairy",
  "MILK": "dairy",
  "CHEESE": "dairy",
  "EGGS": "dairy",
  "YOGURT": "dairy",
  "BUTTER": "dairy",
  // Beverages
  "BEVERAGES": "beverages",
  "SOFT DRINKS": "beverages",
  "DRINKS": "beverages",
  "JUICE": "beverages",
  "WATER": "beverages",
  "ENERGY DRINKS": "beverages",
  "COFFEE": "beverages",
  "TEA": "beverages",
  // Frozen
  "FROZEN": "frozen",
  "FROZEN FOODS": "frozen",
  "FROZEN FOOD": "frozen",
  // Household
  "HOUSEHOLD": "household",
  "CLEANING": "household",
  "LAUNDRY": "household",
  "HOMECARE": "household",
  // Meat & Fish
  "MEAT": "meat",
  "FISH": "meat",
  "MEAT & FISH": "meat",
  "POULTRY": "meat",
  "SEAFOOD": "meat",
  // Ambients & Sweets
  "CONFECTIONERY": "treats",
  "CHOCOLATE": "treats",
  "SWEETS": "treats",
  "CANDY": "treats",
  "AMBIENTS": "treats",
  // Crisps
  "CRISPS": "crisps",
  "SNACKS": "crisps",
  "CRISPS & SNACKS": "crisps",
  // Biscuits
  "BISCUITS": "biscuits",
  "COOKIES": "biscuits",
  // Cereals
  "CEREALS": "cereals",
  "CEREAL": "cereals",
  "BREAKFAST": "cereals",
  "BREAKFAST CEREALS": "cereals",
  // Tobacco
  "TOBACCO": "tobacco",
  "CIGARETTES": "tobacco",
  "CIGARETTES & TOBACCO": "tobacco",
  "CIGARS": "tobacco",
  "VAPING": "tobacco",
  // World Foods
  "WORLD FOODS": "world-foods",
  "ASIAN": "world-foods",
  "AFRICAN": "world-foods",
  "INTERNATIONAL": "world-foods",
  "ETHNIC": "world-foods",
  // Babies & Toiletries
  "BABIES": "babies",
  "BABY": "babies",
  "TOILETRIES": "babies",
  "PERSONAL CARE": "babies",
  "HEALTH & BEAUTY": "babies",
  // Charcoal
  "CHARCOAL": "charcoal",
  "BBQ": "charcoal",
  // Pet Foods
  "PET": "pet-foods",
  "PET FOOD": "pet-foods",
  "PET FOODS": "pet-foods",
  "PETS": "pet-foods",
};

export function mapEposCategory(product: EposProduct): string {
  const candidates = [
    product.subcategoryname,
    product.Category_Name2,
    product.Category_Name1,
    product.Category_Name3,
  ];

  for (const cat of candidates) {
    if (!cat) continue;
    const upper = cat.trim().toUpperCase();
    if (CATEGORY_MAP[upper]) return CATEGORY_MAP[upper];
  }
  return "household";
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
