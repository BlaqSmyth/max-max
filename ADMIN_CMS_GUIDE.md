# Max & Max Admin CMS Guide

## Overview
The Admin CMS allows you to easily manage all products in your Max & Max grocery e-commerce website. You can add, edit, delete products, and upload product images directly to cloud storage.

## Features

### 🔐 Authentication
- Simple password-based access control
- Default password: `admin123`
- Can be changed via environment variable `ADMIN_PASSWORD`

### 📦 Product Management
- **View all products** in a searchable table
- **Add new products** with image upload
- **Edit existing products** with all details
- **Delete products** with confirmation
- **Search products** by name
- **Filter by category** (beverages, dairy, bakery, produce, meat, ready-meals, alcohol)

### 📸 Image Upload
- Upload product images directly from admin panel
- Images stored in Replit Object Storage
- Automatic image optimization
- Supports: JPG, PNG, GIF, WEBP, SVG

## How to Access

1. Navigate to `/admin/login`
2. Enter the admin password (default: `admin123`)
3. You'll be redirected to the admin dashboard

## How to Use

### Adding a Product

1. Go to **Products** page (`/admin/products`)
2. Click **"Add Product"** button
3. Fill in product details:
   - **Product Name**: e.g., "Coca Cola 2L Bottle"
   - **Description**: Brief product description
   - **Category**: Select from dropdown
   - **Price**: Regular price in £
   - **Member Price**: Optional member discount price
   - **Stock**: Quantity in stock
4. **Upload Image**:
   - Click "Select Image"
   - Choose image file from your computer
   - Click "Upload" to upload to cloud storage
5. Click **"Save Product"**

### Editing a Product

1. Find the product in the table
2. Click the **Edit** icon (pencil)
3. Update any fields
4. Click **"Save Product"**

### Deleting a Product

1. Find the product in the table
2. Click the **Delete** icon (trash)
3. Confirm deletion

### Searching Products

- Use the search bar at the top of the products table
- Search filters by product name

## Object Storage Setup

### First-Time Setup

The admin CMS requires Replit Object Storage to be configured:

1. Open the **Object Storage** tool pane in Replit
2. Create a new bucket (if you haven't already)
3. Note the bucket path (e.g., `/my-bucket-name`)
4. Set environment variables:
   ```
   PUBLIC_OBJECT_SEARCH_PATHS=/my-bucket-name/public
   PRIVATE_OBJECT_DIR=/my-bucket-name/.private
   ```
5. Restart the application

### Directory Structure

```
/my-bucket-name/
  ├── public/           # Public assets (served via /public-objects/)
  │   └── products/     # Uploaded product images
  └── .private/         # Private files
      └── products/     # Temp upload location
```

## API Endpoints

### Admin Endpoints (Require Authentication)

- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/upload` - Upload image

### Public Endpoints

- `GET /api/products` - Get all products (for frontend)
- `GET /public-objects/:filePath` - Serve public images

## Security

- Admin endpoints require Bearer token authentication
- Token is stored in browser localStorage
- Set custom admin password via `ADMIN_PASSWORD` environment variable
- Recommended: Use a strong password in production

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Admin login password | `mySecurePassword123` |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Object storage public paths | `/bucket-name/public` |
| `PRIVATE_OBJECT_DIR` | Object storage private directory | `/bucket-name/.private` |

## Tips

1. **Bulk Import**: The system automatically seeds 7 sample beverage products on first run
2. **Image Guidelines**: Use transparent PNG images with white backgrounds for best results
3. **Pricing**: Member prices are optional - leave blank if not offering member discount
4. **Categories**: Keep products organized by category for better customer experience
5. **Stock**: Set to 0 to mark product as out of stock

## Troubleshooting

### "Failed to upload file"
- Check that Object Storage is properly configured
- Verify environment variables are set
- Ensure bucket exists in Object Storage tool pane

### "Unauthorized" error
- Clear browser localStorage and login again
- Verify admin password is correct
- Check that `Authorization` header is being sent

### Images not loading
- Verify `PUBLIC_OBJECT_SEARCH_PATHS` is set correctly
- Check that images are uploaded to `products/` folder
- Ensure bucket permissions allow public read access

## Next Steps

- [ ] Configure Object Storage (see setup section above)
- [ ] Change default admin password
- [ ] Upload your existing product catalog
- [ ] Add real manufacturer product images
- [ ] Test the admin CMS functionality

---

**Need Help?** Check the console logs for error messages or review the application logs in the Replit workspace.
