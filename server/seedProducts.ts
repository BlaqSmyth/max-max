import { storage } from "./storage";
import { type InsertProduct } from "@shared/schema";

// Import mock data products
const mockProducts = [
  {
    name: "Pepsi Cola 2L Bottle",
    description: "Classic Pepsi cola, refreshing and bold taste",
    category: "beverages",
    price: 2.29,
    memberPrice: 1.99,
    image: "/attached_assets/pepsi_2l.png",
    inStock: 1,
  },
  {
    name: "Coca Cola 2L Bottle",
    description: "Original Coca-Cola, the iconic cola taste",
    category: "beverages",
    price: 2.29,
    memberPrice: 1.99,
    image: "/attached_assets/coca_cola_2l.png",
    inStock: 1,
  },
  {
    name: "Sprite 2L Bottle",
    description: "Crisp lemon-lime flavored soda, refreshingly clear",
    category: "beverages",
    price: 2.19,
    memberPrice: 1.99,
    image: "/attached_assets/sprite_2l.png",
    inStock: 1,
  },
  {
    name: "Tango Orange 500ml Bottle",
    description: "Fizzy orange soft drink with real fruit juice",
    category: "beverages",
    price: 1.25,
    memberPrice: 1.00,
    image: "/attached_assets/tango_orange_500ml.png",
    inStock: 1,
  },
  {
    name: "Vimto 500ml Bottle",
    description: "Mixed fruit flavored soft drink",
    category: "beverages",
    price: 1.25,
    memberPrice: 1.10,
    image: "/attached_assets/vimto_500ml.png",
    inStock: 1,
  },
  {
    name: "Red Bull Energy Drink 250ml Can",
    description: "Original Red Bull energy drink with caffeine and taurine",
    category: "beverages",
    price: 1.69,
    memberPrice: 1.49,
    image: "/attached_assets/red_bull_250ml.png",
    inStock: 1,
  },
  {
    name: "Monster Energy 500ml Can",
    description: "Monster energy drink for maximum energy boost",
    category: "beverages",
    price: 1.79,
    memberPrice: 1.59,
    image: "/attached_assets/monster_energy_500ml.png",
    inStock: 1,
  },
  // Add more products as needed...
];

export async function seedProducts() {
  console.log("Seeding products...");
  
  const existingProducts = await storage.getAllProducts();
  if (existingProducts.length > 0) {
    console.log(`Already have ${existingProducts.length} products, skipping seed`);
    return;
  }

  for (const productData of mockProducts) {
    const insertProduct: InsertProduct = {
      ...productData,
      description: productData.description || null,
      memberPrice: productData.memberPrice || null,
    };
    await storage.createProduct(insertProduct);
  }

  console.log(`Seeded ${mockProducts.length} products successfully`);
}
