import fs from "node:fs";
import path from "node:path";

// Product names from the brochure CSV
const PRODUCT_NAMES = [
  "Red Bull Energy 250ml", "Red Bull Sugar Free 250ml", "Red Bull Tropical 250ml",
  "Red Bull Coconut 250ml", "Red Bull Watermelon 250ml", "Red Bull Cactus 250ml",
  "Red Bull Apricot Strawberry 250ml", "Red Bull Juneberry 250ml", "Red Bull Winter Spiced Pear 250ml",
  "Innocent Mango Passion Fruit Smoothie 250ml", "Innocent Strawberry Banana Smoothie 250ml",
  "Innocent Guava Pineapple Smoothie 250ml", "Jacks Meat Feast Pizza 386g", "Jacks Cheese Pizza 386g",
  "Jacks Skin On Fries 750g", "Velvet Classic Quilted Toilet Roll 16 Pack",
  "Walkers Cheese & Onion Crisps 150g", "Walkers Ready Salted Crisps 150g", "Walkers Salt & Vinegar Crisps 150g",
  "Cadbury Milk Tray 530g", "Hardys Bin 161 Rose Wine 75cl", "Hardys Bin 161 Sauvignon Blanc 75cl",
  "Hardys Bin 161 Chardonnay 75cl", "Hardys Bin 161 Pinot Grigio 75cl", "Hardys Bin 161 Shiraz 75cl",
  "Hardys Bin 161 Merlot 75cl", "Cruzcampo Lager 10x440ml", "Inchs Medium Apple Cider 10x440ml",
  "Old Mout Pineapple Raspberry Cider 10x330ml", "Sol Lager 12x330ml", "Strongbow Cider 10x440ml",
  "Carling Lager 10x440ml", "Coors Lager 10x440ml", "Jacks Cooking Onions 1kg", "Jacks Broccoli 350g",
  "Jacks White Potatoes 2kg", "Jacks Carrots 500g", "Reeses Hollow Easter Egg 252g",
  "Kit Kat Chunky Biscoff Easter Egg 233g", "Milkybar Giant Egg with Mini Eggs 230g",
  "Cadbury Mini Eggs XL Shell Egg 232g", "Cadbury Creme Egg XL Easter Egg 235g", "Celebrations Tub 600g",
  "Twix White XL Easter Egg 316g", "Cadbury Mini Egg Nests 4 Pack", "Mr Kipling Lemon Raspberry Mini Battenburgs 5 Pack",
  "Cathedral City Mature Cheddar 350g", "Cathedral City Extra Mature Cheddar 350g", "Cathedral City Lighter Cheddar 350g",
  "Wotsits Giants Prawn Cocktail 105g", "Wotsits Giants Cheese 130g", "Wotsits Giants Flamin Hot 130g",
  "Mogu Mogu Lychee Drink 320ml", "Mogu Mogu Melon Drink 320ml", "Mogu Mogu Mango Drink 320ml",
  "Pepsi Max 2L", "Pepsi Diet 2L", "Pepsi Max Cherry 2L", "Pepsi Regular 2L",
  "Monster Energy 4x500ml", "Monster Mango Loco 4x500ml", "Monster Ultra Energy 4x500ml",
  "Aero Milk Chocolate Bar 36g", "Aero Peppermint Chocolate Bar 36g", "Kit Kat 4 Finger 41.5g",
  "Kit Kat 4 Finger Caramel 41.5g", "Kit Kat Chunky 40g", "Kit Kat Chunky Runny Caramel 43.5g",
  "Kit Kat Chunky Peanut Butter 42g", "Kit Kat 4 Finger Dark 41.5g", "Kit Kat 4 Finger White 41.5g",
  "Milkybar 25g", "Rolo Tube 52g", "Smarties Tube 38g", "Smarties White Tube 36g",
  "Toffee Crisp Bar 38g", "Yorkie Milk Chocolate 46g", "Yorkie Raisin Biscuit 44g",
  "Kit Kat Chunky Biscoff White 42g", "Haribo Tangfastics 140g", "Haribo Starmix 140g",
  "Haribo Supermix 140g", "Haribo Giant Strawbs 140g", "Haribo Bubblegum Bottles Zing 160g",
  "Haribo Twin Snakes 160g", "Haribo Sour Sparks 160g", "Haribo Soda Twist Zing 160g",
  "McGuigan Black Label Shiraz 75cl", "McGuigan Black Label Chardonnay 75cl", "McGuigan Black Label Red 75cl",
  "McGuigan Black Label Pinot Grigio 75cl", "McGuigan Black Label Sauvignon Blanc 75cl",
  "Isla Negra Seashore Rose 75cl", "Isla Negra Seashore Merlot 75cl", "Isla Negra Seashore Sauvignon Blanc 75cl",
  "Isla Negra Malbec 75cl", "Birra Moretti 4x440ml", "Strongbow Dark Fruit Cider 4x440ml",
];

interface ImageMatch {
  imagePath: string;
  productName: string | null;
  confidence: number;
  aiResponse?: string;
}

async function analyzeImage(imagePath: string): Promise<ImageMatch> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error("AI integrations not configured");
  }

  const body = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `What grocery product is this? Reply with ONLY the product name. If unclear, say UNKNOWN.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
              detail: "low",
            },
          },
        ],
      },
    ],
    max_tokens: 50,
  };

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    const content = (data.choices?.[0]?.message?.content || "").trim();

    // Match against product names
    const matchedProduct = PRODUCT_NAMES.find(p => {
      const pLower = p.toLowerCase();
      const cLower = content.toLowerCase();
      return cLower.includes(pLower) || pLower.includes(cLower) ||
        pLower.split(" ").every(word => cLower.includes(word));
    });

    return {
      imagePath,
      productName: matchedProduct || null,
      confidence: matchedProduct ? 0.8 : 0,
      aiResponse: content,
    };
  } catch (error: any) {
    console.error(`Error: ${path.basename(imagePath)}: ${error.message}`);
    return { imagePath, productName: null, confidence: 0 };
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const imageDir = "attached_assets/extracted_images";
  const files = fs.readdirSync(imageDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  
  console.log(`Found ${files.length} images to process`);
  console.log("Testing with first 10 images...\n");

  // Test with just 10 images first
  const testFiles = files.slice(0, 10);
  const results: ImageMatch[] = [];

  for (let i = 0; i < testFiles.length; i++) {
    const file = testFiles[i];
    console.log(`Processing ${i + 1}/${testFiles.length}: ${file}`);
    
    const result = await analyzeImage(path.join(imageDir, file));
    results.push(result);
    
    if (result.productName) {
      console.log(`  -> Matched: ${result.productName}`);
    } else {
      console.log(`  -> AI said: "${result.aiResponse || 'error'}"`);
    }

    // Rate limiting
    await sleep(500);
  }

  const matched = results.filter(r => r.productName);
  console.log(`\n=== Test Results ===`);
  console.log(`Matched: ${matched.length}/${testFiles.length}`);
  
  if (matched.length > 0) {
    console.log("\nMatched products:");
    matched.forEach(m => console.log(`  ${path.basename(m.imagePath)} -> ${m.productName}`));
  }
}

main().catch(console.error);
