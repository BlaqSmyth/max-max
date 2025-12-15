import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import pLimit from "p-limit";
import pRetry from "p-retry";

// Using Replit's AI Integrations - no API key needed, charges to credits
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

// Product names from the brochure CSV
const PRODUCT_NAMES = [
  "Red Bull Energy 250ml",
  "Red Bull Sugar Free 250ml",
  "Red Bull Tropical 250ml",
  "Red Bull Coconut 250ml",
  "Red Bull Watermelon 250ml",
  "Red Bull Cactus 250ml",
  "Red Bull Apricot Strawberry 250ml",
  "Red Bull Juneberry 250ml",
  "Red Bull Winter Spiced Pear 250ml",
  "Innocent Mango Passion Fruit Smoothie 250ml",
  "Innocent Strawberry Banana Smoothie 250ml",
  "Innocent Guava Pineapple Smoothie 250ml",
  "Jacks Meat Feast Pizza 386g",
  "Jacks Cheese Pizza 386g",
  "Jacks Skin On Fries 750g",
  "Velvet Classic Quilted Toilet Roll 16 Pack",
  "Walkers Cheese & Onion Crisps 150g",
  "Walkers Ready Salted Crisps 150g",
  "Walkers Salt & Vinegar Crisps 150g",
  "Cadbury Milk Tray 530g",
  "Hardys Bin 161 Rose Wine 75cl",
  "Hardys Bin 161 Sauvignon Blanc 75cl",
  "Hardys Bin 161 Chardonnay 75cl",
  "Hardys Bin 161 Pinot Grigio 75cl",
  "Hardys Bin 161 Shiraz 75cl",
  "Hardys Bin 161 Merlot 75cl",
  "Cruzcampo Lager 10x440ml",
  "Inchs Medium Apple Cider 10x440ml",
  "Old Mout Pineapple Raspberry Cider 10x330ml",
  "Sol Lager 12x330ml",
  "Strongbow Cider 10x440ml",
  "Carling Lager 10x440ml",
  "Coors Lager 10x440ml",
  "Jacks Cooking Onions 1kg",
  "Jacks Broccoli 350g",
  "Jacks White Potatoes 2kg",
  "Jacks Carrots 500g",
  "Reeses Hollow Easter Egg 252g",
  "Kit Kat Chunky Biscoff Easter Egg 233g",
  "Milkybar Giant Egg with Mini Eggs 230g",
  "Cadbury Mini Eggs XL Shell Egg 232g",
  "Cadbury Creme Egg XL Easter Egg 235g",
  "Celebrations Tub 600g",
  "Twix White XL Easter Egg 316g",
  "Cadbury Mini Egg Nests 4 Pack",
  "Mr Kipling Lemon Raspberry Mini Battenburgs 5 Pack",
  "Cathedral City Mature Cheddar 350g",
  "Cathedral City Extra Mature Cheddar 350g",
  "Cathedral City Lighter Cheddar 350g",
  "Wotsits Giants Prawn Cocktail 105g",
  "Wotsits Giants Cheese 130g",
  "Wotsits Giants Flamin Hot 130g",
  "Mogu Mogu Lychee Drink 320ml",
  "Mogu Mogu Melon Drink 320ml",
  "Mogu Mogu Mango Drink 320ml",
  "Pepsi Max 2L",
  "Pepsi Diet 2L",
  "Pepsi Max Cherry 2L",
  "Pepsi Regular 2L",
  "Monster Energy 4x500ml",
  "Monster Mango Loco 4x500ml",
  "Monster Ultra Energy 4x500ml",
  "Aero Milk Chocolate Bar 36g",
  "Aero Peppermint Chocolate Bar 36g",
  "Kit Kat 4 Finger 41.5g",
  "Kit Kat 4 Finger Caramel 41.5g",
  "Kit Kat Chunky 40g",
  "Kit Kat Chunky Runny Caramel 43.5g",
  "Kit Kat Chunky Peanut Butter 42g",
  "Kit Kat 4 Finger Dark 41.5g",
  "Kit Kat 4 Finger White 41.5g",
  "Milkybar 25g",
  "Rolo Tube 52g",
  "Smarties Tube 38g",
  "Smarties White Tube 36g",
  "Toffee Crisp Bar 38g",
  "Yorkie Milk Chocolate 46g",
  "Yorkie Raisin Biscuit 44g",
  "Kit Kat Chunky Biscoff White 42g",
  "Haribo Tangfastics 140g",
  "Haribo Starmix 140g",
  "Haribo Supermix 140g",
  "Haribo Giant Strawbs 140g",
  "Haribo Bubblegum Bottles Zing 160g",
  "Haribo Twin Snakes 160g",
  "Haribo Sour Sparks 160g",
  "Haribo Soda Twist Zing 160g",
  "McGuigan Black Label Shiraz 75cl",
  "McGuigan Black Label Chardonnay 75cl",
  "McGuigan Black Label Red 75cl",
  "McGuigan Black Label Pinot Grigio 75cl",
  "McGuigan Black Label Sauvignon Blanc 75cl",
  "Isla Negra Seashore Rose 75cl",
  "Isla Negra Seashore Merlot 75cl",
  "Isla Negra Seashore Sauvignon Blanc 75cl",
  "Isla Negra Malbec 75cl",
  "Birra Moretti 4x440ml",
  "Strongbow Dark Fruit Cider 4x440ml",
];

interface ImageMatch {
  imagePath: string;
  productName: string | null;
  confidence: number;
}

// Check if error is rate limit
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Analyze a single image using GPT-4o-mini vision
async function analyzeImage(imagePath: string): Promise<ImageMatch> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using cheaper model for cost efficiency
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify this product image. Reply with ONLY the exact product name from this list if it matches, or say UNKNOWN:\n\n${PRODUCT_NAMES.slice(0, 30).join(", ")}\n\nRespond with just the product name, nothing else.`,
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
    });

    const content = (response.choices[0]?.message?.content || "").trim();
    
    // Check if response matches a product name
    const matchedProduct = PRODUCT_NAMES.find(p => 
      content.toLowerCase().includes(p.toLowerCase()) ||
      p.toLowerCase().includes(content.toLowerCase())
    );
    
    return {
      imagePath,
      productName: matchedProduct || null,
      confidence: matchedProduct ? 0.8 : 0,
    };
  } catch (error: any) {
    console.error(`Error analyzing ${path.basename(imagePath)}:`, error.message);
    return {
      imagePath,
      productName: null,
      confidence: 0,
    };
  }
}

// Process all images with rate limiting and retries
async function processAllImages(imageDir: string): Promise<ImageMatch[]> {
  const files = fs.readdirSync(imageDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  console.log(`Found ${files.length} images to process`);

  const limit = pLimit(3); // Process 3 at a time
  const results: ImageMatch[] = [];
  let processed = 0;

  const promises = files.map((file) =>
    limit(() =>
      pRetry(
        async () => {
          const result = await analyzeImage(path.join(imageDir, file));
          processed++;
          if (processed % 10 === 0) {
            console.log(`Progress: ${processed}/${files.length} (${Math.round(processed/files.length*100)}%)`);
          }
          return result;
        },
        {
          retries: 5,
          minTimeout: 2000,
          maxTimeout: 30000,
          factor: 2,
          onFailedAttempt: (error) => {
            if (isRateLimitError(error)) {
              console.log(`Rate limited, retrying...`);
            }
          },
        }
      )
    )
  );

  const allResults = await Promise.all(promises);
  return allResults;
}

// Group matches by product and pick the best image for each
function findBestMatches(matches: ImageMatch[]): Map<string, string> {
  const productImages = new Map<string, { imagePath: string; confidence: number }>();

  for (const match of matches) {
    if (match.productName && match.confidence > 0.5) {
      const existing = productImages.get(match.productName);
      if (!existing || match.confidence > existing.confidence) {
        productImages.set(match.productName, {
          imagePath: match.imagePath,
          confidence: match.confidence,
        });
      }
    }
  }

  const result = new Map<string, string>();
  for (const [product, { imagePath }] of productImages) {
    result.set(product, imagePath);
  }
  return result;
}

async function main() {
  const imageDir = "attached_assets/extracted_images";
  
  console.log("Starting image matching process...");
  console.log("This uses AI vision to identify products in each image.\n");

  const matches = await processAllImages(imageDir);
  
  // Find matched products
  const matched = matches.filter(m => m.productName);
  const unmatched = matches.filter(m => !m.productName);
  
  console.log(`\n=== Results ===`);
  console.log(`Matched: ${matched.length} images`);
  console.log(`Unmatched: ${unmatched.length} images`);

  // Get best image for each product
  const bestMatches = findBestMatches(matches);
  console.log(`\nUnique products matched: ${bestMatches.size}`);

  // Save results
  const outputPath = "attached_assets/image_matches.json";
  const output = {
    matched: Array.from(bestMatches.entries()).map(([product, image]) => ({
      product,
      image: path.basename(image),
    })),
    unmatchedProducts: PRODUCT_NAMES.filter(p => !bestMatches.has(p)),
    totalImagesProcessed: matches.length,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${outputPath}`);

  // Show matched products
  console.log("\n=== Matched Products ===");
  for (const [product, image] of bestMatches) {
    console.log(`  ${product} -> ${path.basename(image)}`);
  }

  // Show unmatched products
  if (output.unmatchedProducts.length > 0) {
    console.log("\n=== Products Without Images ===");
    output.unmatchedProducts.forEach(p => console.log(`  - ${p}`));
  }
}

main().catch(console.error);
