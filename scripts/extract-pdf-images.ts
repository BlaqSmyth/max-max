import * as fs from 'fs';
import * as path from 'path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const PDF_PATH = 'attached_assets/BUD_NP1_Trading_Pack-7-50split_1765814714310.pdf';
const OUTPUT_DIR = 'attached_assets/extracted_images';

async function extractImages() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Loading PDF...');
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await getDocument({ data }).promise;
  
  console.log(`PDF has ${doc.numPages} pages`);
  
  let imageCount = 0;
  
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    console.log(`Processing page ${pageNum}...`);
    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();
    
    // Look for image operations
    for (let i = 0; i < ops.fnArray.length; i++) {
      // Check for image XObject operations
      if (ops.fnArray[i] === 85) { // OPS.paintImageXObject
        const imgName = ops.argsArray[i][0];
        try {
          const img = await page.objs.get(imgName);
          if (img && img.data) {
            imageCount++;
            const filename = `image_p${pageNum}_${imageCount}.png`;
            console.log(`  Found image: ${filename} (${img.width}x${img.height})`);
            
            // Save raw image data
            // Note: This is simplified - actual PNG encoding would need more work
          }
        } catch (e) {
          // Skip if can't get image
        }
      }
    }
  }
  
  console.log(`\nFound ${imageCount} images total`);
  await doc.destroy();
}

extractImages().catch(console.error);
