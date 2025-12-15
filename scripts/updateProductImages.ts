import fs from "node:fs";
import path from "node:path";

// Parse the matches file
const matchesFile = "/tmp/matches.txt";
const matches = fs.readFileSync(matchesFile, "utf-8")
  .split("\n")
  .filter(line => line.includes(" -> "))
  .map(line => {
    const [image, product] = line.split(" -> ");
    return { image: image.trim(), product: product.trim() };
  });

console.log(`Found ${matches.length} matches`);

// Get first image for each product
const productImages = new Map<string, string>();
for (const match of matches) {
  if (!productImages.has(match.product)) {
    productImages.set(match.product, match.image);
  }
}

console.log(`\nUnique products: ${productImages.size}`);
for (const [product, image] of productImages) {
  console.log(`  ${product} -> ${image}`);
}

// Copy images to a stable location
const sourceDir = "attached_assets/extracted_images";
const destDir = "attached_assets/product_images";

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Create a mapping file for updating seeds
const imageMapping: Record<string, string> = {};

for (const [product, image] of productImages) {
  const sourcePath = path.join(sourceDir, image);
  const destPath = path.join(destDir, image);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    imageMapping[product] = `attached_assets/product_images/${image}`;
    console.log(`Copied: ${image}`);
  } else {
    console.log(`Missing: ${image}`);
  }
}

// Save mapping
fs.writeFileSync("attached_assets/product_image_mapping.json", JSON.stringify(imageMapping, null, 2));
console.log(`\nMapping saved to attached_assets/product_image_mapping.json`);

// Now read the seed file and update
const seedPath = "server/seedProducts.ts";
let seedContent = fs.readFileSync(seedPath, "utf-8");

let updatedCount = 0;
for (const [productName, imagePath] of Object.entries(imageMapping)) {
  // Find the product in the seed file and update its image
  // Pattern: name: "Product Name",...image: "old/path"
  const namePattern = `name: "${productName}"`;
  if (seedContent.includes(namePattern)) {
    // Find the line with this product name and update the image field after it
    const lines = seedContent.split("\n");
    let inProduct = false;
    let productBraceDepth = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(namePattern)) {
        inProduct = true;
        productBraceDepth = 1;
      }
      
      if (inProduct) {
        // Track brace depth
        productBraceDepth += (lines[i].match(/\{/g) || []).length;
        productBraceDepth -= (lines[i].match(/\}/g) || []).length;
        
        // Look for image field
        if (lines[i].includes('image:')) {
          const oldLine = lines[i];
          lines[i] = lines[i].replace(/image: ".*?"/, `image: "${imagePath}"`);
          if (oldLine !== lines[i]) {
            console.log(`Updated image for: ${productName}`);
            updatedCount++;
          }
          inProduct = false;
          break;
        }
        
        if (productBraceDepth <= 0) {
          inProduct = false;
        }
      }
    }
    
    seedContent = lines.join("\n");
  }
}

fs.writeFileSync(seedPath, seedContent);
console.log(`\nUpdated ${updatedCount} products in ${seedPath}`);
