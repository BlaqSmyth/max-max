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

      // Parse CSV
      const csvContent = csvEntry.getData().toString('utf8');
      const lines = csvContent.trim().split("\n");
      
      if (lines.length < 2) {
        return res.status(400).json({ error: "CSV file is empty or invalid" });
      }

      const headers = lines[0].split(",").map(h => h.trim());
      const imageIndex = headers.indexOf("image");
      
      if (imageIndex === -1) {
        return res.status(400).json({ error: "CSV must have an 'image' column" });
      }

      // Upload all image files from ZIP and create filename-to-URL mapping
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
          imageUrlMap.set(filename, imageUrl);
        }
      }

      // Parse products and map image filenames to uploaded URLs
      const products: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim());
        if (values.length !== headers.length) continue;

        const product: any = {};
        headers.forEach((header, index) => {
          const value = values[index];
          if (header === "name") product.name = value;
          else if (header === "description") product.description = value || null;
          else if (header === "category") product.category = value;
          else if (header === "price") product.price = value;
          else if (header === "memberPrice") product.memberPrice = value || null;
          else if (header === "image") {
            // Map image filename to uploaded URL
            const filename = path.basename(value);
            const imageUrl = imageUrlMap.get(filename);
            if (imageUrl) {
              product.image = imageUrl;
            } else {
              // If not found in ZIP, use the value as-is (could be a URL)
              product.image = value;
            }
          }
          else if (header === "inStock") product.inStock = parseInt(value) || 1;
        });

        if (product.name && product.category && product.price && product.image) {
          products.push(product);
        }
      }

      if (products.length === 0) {
        return res.status(400).json({ error: "No valid products found in CSV" });
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
