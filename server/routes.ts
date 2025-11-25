import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { insertProductSchema } from "@shared/schema";
import { 
  adminAuthMiddleware, 
  adminAuthService, 
  verifyAdminPassword 
} from "./adminAuth";
import multer from "multer";
import express from "express";
import path from "path";
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  // Serve attached assets (images, etc.)
  app.use("/attached_assets", express.static(path.join(process.cwd(), "attached_assets")));

  // Serve public objects from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin login endpoint - verifies password and returns session token
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password || !verifyAdminPassword(password)) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = adminAuthService.createSession();
      res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        adminAuthService.revokeToken(token);
      }
      res.status(204).send();
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin: Get all products
  app.get("/api/admin/products", adminAuthMiddleware, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin: Create product
  app.post("/api/admin/products", adminAuthMiddleware, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Admin: Bulk create products
  app.post("/api/admin/products/bulk", adminAuthMiddleware, async (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Invalid products array" });
      }

      const validatedProducts = products.map((p) => insertProductSchema.parse(p));
      const createdProducts = await storage.createProducts(validatedProducts);
      
      res.status(201).json({ 
        count: createdProducts.length, 
        products: createdProducts 
      });
    } catch (error) {
      console.error("Error bulk creating products:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Admin: Bulk upload from ZIP (CSV + images)
  app.post("/api/admin/products/bulk-zip", adminAuthMiddleware, upload.single("zip"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No ZIP file uploaded" });
      }

      // Extract ZIP file
      const zip = new AdmZip(req.file.buffer);
      const zipEntries = zip.getEntries();

      // Find CSV file
      const csvEntry = zipEntries.find(entry => 
        !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.csv')
      );

      if (!csvEntry) {
        return res.status(400).json({ error: "No CSV file found in ZIP" });
      }

      // Parse CSV using proper RFC 4180 parser (handles quoted fields, escaped commas, etc.)
      const csvContent = csvEntry.getData().toString('utf8');
      
      let records: any[];
      try {
        records = parse(csvContent, {
          columns: true, // Use first row as headers
          skip_empty_lines: true,
          trim: true,
          relax_column_count: false, // Strict column count validation
        });
      } catch (parseError: any) {
        return res.status(400).json({ 
          error: "CSV parsing failed", 
          details: [parseError.message]
        });
      }
      
      if (records.length === 0) {
        return res.status(400).json({ error: "CSV file has no data rows" });
      }

      // Image column is optional - we can auto-match based on product name
      const hasImageColumn = records[0].hasOwnProperty('image');

      // Upload all image files from ZIP and create filename-to-URL mapping (case-insensitive)
      const imageUrlMap = new Map<string, string>();
      
      for (const entry of zipEntries) {
        if (!entry.isDirectory && entry.entryName.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
          const filename = path.basename(entry.entryName);
          const imageBuffer = entry.getData();
          
          // Determine MIME type from extension
          const ext = path.extname(filename).toLowerCase();
          const mimeTypes: { [key: string]: string } = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.gif': 'image/gif'
          };
          const mimeType = mimeTypes[ext] || 'image/png';
          
          // Upload to object storage
          const imageUrl = await objectStorageService.uploadFile(imageBuffer, mimeType);
          // Store with normalized filename (lowercase) for case-insensitive matching
          imageUrlMap.set(filename.toLowerCase(), imageUrl);
        }
      }

      if (imageUrlMap.size === 0) {
        return res.status(400).json({ error: "No image files found in ZIP. Include at least one .png, .jpg, .jpeg, .webp, or .gif file." });
      }

      // Parse products and map image filenames to uploaded URLs
      const products: any[] = [];
      const parseErrors: string[] = [];
      const missingImages: string[] = [];
      
      for (let i = 0; i < records.length; i++) {
        const lineNumber = i + 2; // +2 because of header row and 1-indexed
        const record = records[i];

        // Parse inStock with strict validation - ONLY accept pure integers (no decimals, no text)
        let inStockValue = 1;
        if (record.inStock !== undefined && record.inStock !== null && record.inStock !== '') {
          const inStockStr = String(record.inStock).trim();
          // Reject anything that's not a non-negative integer (no decimals, no text)
          if (!/^\d+$/.test(inStockStr)) {
            parseErrors.push(`Row ${lineNumber}: Invalid inStock value "${record.inStock}" (must be a non-negative integer like "1" or "100")`);
            continue; // Skip this product
          }
          inStockValue = parseInt(inStockStr, 10);
        }

        const product: any = {
          name: record.name || '',
          description: record.description || null,
          category: record.category || '',
          price: record.price || '',
          memberPrice: record.memberPrice || null,
          inStock: inStockValue,
        };

        // Handle image field
        let imageValue = (record.image || '').trim();
        
        // If no image value provided, try to auto-match based on product name
        if (!imageValue && product.name) {
          // Convert product name to slug: lowercase, replace spaces/special chars with hyphens
          const slug = product.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
          
          // Look for any image file that starts with this slug
          for (const [filename, url] of Array.from(imageUrlMap.entries())) {
            const filenameWithoutExt = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '');
            if (filenameWithoutExt === slug) {
              imageValue = filename; // Found a match!
              product.image = url;
              break;
            }
          }
          
          if (!imageValue) {
            missingImages.push(`Row ${lineNumber}: No image found for "${product.name}" (expected filename like "${slug}.png")`);
          }
        } else if (imageValue) {
          // Image value provided in CSV - try to match from ZIP
          const imageFilename = path.basename(imageValue).trim();
          // Case-insensitive lookup
          const imageUrl = imageUrlMap.get(imageFilename.toLowerCase());
          if (imageUrl) {
            product.image = imageUrl;
          } else {
            // Check if it's a URL (starts with http:// or https:// or /)
            if (imageValue.startsWith('http://') || imageValue.startsWith('https://') || imageValue.startsWith('/')) {
              product.image = imageValue; // Allow external URLs
            } else {
              missingImages.push(`Row ${lineNumber}: Image "${imageFilename}" not found in ZIP`);
              product.image = imageValue; // Still assign but will fail validation
            }
          }
        }

        if (product.name && product.category && product.price && product.image) {
          products.push(product);
        } else {
          const missing = [];
          if (!product.name) missing.push('name');
          if (!product.category) missing.push('category');
          if (!product.price) missing.push('price');
          if (!product.image) missing.push('image');
          parseErrors.push(`Row ${lineNumber}: Missing required fields: ${missing.join(', ')}`);
        }
      }

      // Report errors if any parsing issues occurred
      if (parseErrors.length > 0 || missingImages.length > 0) {
        const allErrors = [...parseErrors, ...missingImages];
        return res.status(400).json({ 
          error: "Product validation errors",
          details: allErrors.slice(0, 10), // Limit to first 10 errors
          totalErrors: allErrors.length
        });
      }

      if (products.length === 0) {
        return res.status(400).json({ error: "No valid products found in CSV after parsing" });
      }

      // Validate and create products
      const validatedProducts = products.map(p => insertProductSchema.parse(p));
      const createdProducts = await storage.createProducts(validatedProducts);
      
      res.status(201).json({ 
        count: createdProducts.length, 
        products: createdProducts,
        imagesUploaded: imageUrlMap.size
      });
    } catch (error) {
      console.error("Error processing ZIP upload:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to process ZIP file" 
      });
    }
  });

  // Admin: Update product
  app.put("/api/admin/products/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  // Admin: Delete product
  app.delete("/api/admin/products/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin: Upload image
  app.post("/api/admin/upload", adminAuthMiddleware, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = await objectStorageService.uploadFile(
        req.file.buffer,
        req.file.mimetype
      );

      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Public: Get all products (for frontend)
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
