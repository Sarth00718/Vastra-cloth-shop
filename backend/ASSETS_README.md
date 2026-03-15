# Asset Upload System

This system uploads local product images from the frontend assets folder to Cloudinary and creates products in the database.

## Available Methods

### 1. API Endpoint (Recommended for Admin Panel)

**Upload Assets and Create Products:**
```
POST /api/assets/upload-and-create
Authorization: Admin token required
```

### 2. Command Line Script

```bash
cd backend
npm run upload-assets
```

## Product Structure

The system creates **20 products** based on the available images in `frontend/src/assets/`:

### Men's Clothing (7 products):
- Men Cotton Casual Shirt
- Men Formal Shirt  
- Men Cotton T-Shirt
- Men Casual Pants
- Men Formal Trousers
- Men Casual Lower
- Men Winter Jacket

### Women's Clothing (6 products):
- Women Casual Blouse
- Women Formal Shirt
- Women Designer Top
- Women Cotton T-Shirt
- Women Casual Pants
- Women Formal Trousers
- Women Winter Jacket

### Kids' Clothing (7 products):
- Kids Graphic T-Shirt
- Kids Cotton Pants
- Kids Casual Wear Set
- Kids Designer Outfit
- Kids Winter Jacket - Boys
- Kids Winter Jacket - Girls

## Image Mapping

Each product uses 4 related images from the assets folder:

- **Men's Shirts**: `shirtman1.jpg`, `shirtman11.jpg`, etc.
- **Women's Shirts**: `shirtwomen1.jpg`, `shirtwomen11.jpg`, etc.
- **Kids Items**: `kidt-shirt1.jpg`, `kidswear1.jpg`, etc.
- **Jackets**: `jacket for men.jpg`, `jacket for women.jpg`, etc.

## Usage Instructions

### Method 1: API Call (For Admin Panel)

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Make authenticated API call:**
   ```bash
   curl -X POST http://localhost:8000/api/assets/upload-and-create \
   -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

### Method 2: Command Line

1. **Run the upload script:**
   ```bash
   cd backend
   npm run upload-assets
   ```

2. **Verify products were created:**
   ```bash
   curl http://localhost:8000/api/product/list
   ```

## Features

- **Cloudinary Integration**: All images are uploaded to Cloudinary for CDN delivery
- **Error Handling**: Falls back to placeholder images if upload fails
- **Progress Tracking**: Console logs show upload progress
- **Database Cleanup**: Clears existing products before creating new ones
- **Admin Authentication**: API endpoint requires admin authentication

## File Structure

```
backend/
├── controllers/
│   └── assetController.js (API endpoint controller)
├── routes/
│   └── assetRoutes.js (API routes)
├── scripts/
│   └── uploadAssetsToCloudinary.js (standalone script)
└── ASSETS_README.md (this file)
```

## Environment Requirements

Make sure your `.env` file has Cloudinary configuration:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Notes

- Images are uploaded to Cloudinary with automatic optimization
- Each product gets exactly 4 images (duplicates first image if needed)
- Products follow the exact Mongoose schema structure
- All products are clothing items with appropriate categories and subcategories
- Prices range from ₹599 to ₹4,299
- Adult sizes: S, M, L, XL, XXL
- Kids sizes: 2Y, 4Y, 6Y, 8Y, 10Y