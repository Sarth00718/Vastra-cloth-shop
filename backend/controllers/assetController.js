import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadOnCloudinary from '../config/cloudinary.js';
import { Product } from '../models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to frontend assets
const assetsPath = path.join(__dirname, '../../frontend/src/assets');

// Product data structure based on available images
const productData = [
  // Men's Shirts
  {
    name: "Men Cotton Casual Shirt",
    description: "Premium cotton casual shirt designed for everyday comfort and style. Perfect for office wear or casual outings.",
    price: 1299,
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["shirtman1.jpg", "shirtman11.jpg", "shirtman2.jpg", "shirtman22.jpg"]
  },
  {
    name: "Men Formal Shirt",
    description: "Elegant formal shirt crafted from premium cotton. Perfect for business meetings and formal occasions.",
    price: 1599,
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["shirtman3.jpg", "shirtman33.jpg", "shirtman4.jpg", "shirtman44.jpg"]
  },
  
  // Men's T-Shirts
  {
    name: "Men Cotton T-Shirt",
    description: "Classic cotton t-shirt made from breathable fabric. Ideal for casual wear and everyday comfort.",
    price: 899,
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["t-shirtman1.jpg", "t-shirtman2.jpg", "t-shirtman3.jpg", "t-shirtman4.jpg"]
  },
  
  // Men's Pants
  {
    name: "Men Casual Pants",
    description: "Comfortable casual pants suitable for both work and leisure. Made from premium cotton blend.",
    price: 1799,
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["pantman1.jpg", "pantman11.webp", "pantman2.jpg", "pantman22.jpg"]
  },
  {
    name: "Men Formal Trousers",
    description: "Elegant formal trousers with modern fit. Perfect for office wear and formal occasions.",
    price: 2199,
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["pantman3.jpg", "pantman33.jpg", "pantman4.jpg", "pantman44.jpg"]
  },
  {
    name: "Men Casual Lower",
    description: "Comfortable casual lower wear perfect for daily activities and relaxed occasions.",
    price: 1299,
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["manlower1.jpg", "manlower2.jpg", "manlower3.jpg", "manlower4.jpg"]
  },
  
  // Men's Jackets
  {
    name: "Men Winter Jacket",
    description: "Warm and stylish winter jacket with water-resistant coating. Perfect for cold weather protection.",
    price: 3499,
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["jacket for men.jpg", "jacket for men1.jpg", "jacket for men2.jpg", "jacket for men3.jpg"]
  },
  
  // Women's Shirts
  {
    name: "Women Casual Blouse",
    description: "Elegant casual blouse with comfortable fit. Suitable for office wear and casual outings.",
    price: 1399,
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["shirtwomen1.jpg", "shirtwomen11.jpg", "shirtwomen111.jpg", "shirtwomen2.jpg"]
  },
  {
    name: "Women Formal Shirt",
    description: "Professional formal shirt designed for modern working women. Premium quality fabric.",
    price: 1599,
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["shirtwomen22.jpg", "shirtwomen222.jpg", "shirtwomen3.jpg", "shirtwomen33.jpg"]
  },
  {
    name: "Women Designer Top",
    description: "Stylish designer top with contemporary design. Perfect for parties and special occasions.",
    price: 1799,
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["shirtwomen333.jpg", "shirtwomen4.jpg", "shirtwomen44.jpg", "shirtwomen444.jpg"]
  },
  
  // Women's T-Shirts
  {
    name: "Women Cotton T-Shirt",
    description: "Basic cotton t-shirt with comfortable fit. Essential wardrobe staple for everyday wear.",
    price: 699,
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["t-shirtwomen1.jpg", "t-shirtwomen2.jpg", "t-shirtwomen3.jpg", "t-shirtwomen4.jpg"]
  },
  
  // Women's Pants
  {
    name: "Women Casual Pants",
    description: "Comfortable casual pants with modern fit. Perfect for everyday wear and office use.",
    price: 1699,
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["pantwoman1.jpg", "pantwoman11.jpg", "pantwoman144.jpg", "pantwoman2.jpg"]
  },
  {
    name: "Women Formal Trousers",
    description: "Elegant formal trousers designed for professional women. Premium quality and comfortable fit.",
    price: 2299,
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: true,
    images: ["pantwoman22.jpg", "pantwoman3.jpg", "pantwoman33.jpg", "pantwoman4.jpg"]
  },
  
  // Women's Jackets
  {
    name: "Women Winter Jacket",
    description: "Stylish winter jacket with premium insulation. Elegant design with excellent cold weather protection.",
    price: 4299,
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    bestseller: false,
    images: ["jacket for women.jpg", "jacket for women1.jpg", "jacket for women2.jpg", "jacket for women3.jpg"]
  },
  
  // Kids T-Shirts
  {
    name: "Kids Graphic T-Shirt",
    description: "Fun graphic t-shirt for kids with colorful print design. Made from soft cotton for comfort and play.",
    price: 599,
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: true,
    images: ["kidt-shirt1.jpg", "kidt-shirt2.jpg", "kidt-shirt3.jpg", "kidt-shirt4.jpg"]
  },
  
  // Kids Pants
  {
    name: "Kids Cotton Pants",
    description: "Comfortable cotton pants perfect for active kids. Breathable fabric with adjustable waistband.",
    price: 699,
    category: "Kids",
    subCategory: "Bottomwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: false,
    images: ["kidspant1.webp", "kidspant2.jpg", "kidspant3.jpg", "kidspant4.jpg"]
  },
  
  // Kids General Wear
  {
    name: "Kids Casual Wear Set",
    description: "Comfortable casual wear set for kids. Perfect for daily activities and play time.",
    price: 999,
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: true,
    images: ["kidswear1.jpg", "kidswear11.webp", "kidswear2.jpg", "kidswear22.jpg"]
  },
  {
    name: "Kids Designer Outfit",
    description: "Stylish designer outfit for kids. Perfect for parties and special occasions.",
    price: 1299,
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: false,
    images: ["kidswear3.jpg", "kidswear33.jpg", "kidswear4.jpg", "kidswear44.jpg"]
  },
  
  // Kids Jackets
  {
    name: "Kids Winter Jacket - Boys",
    description: "Warm winter jacket designed for boys. Lightweight yet insulated for cold weather protection.",
    price: 1999,
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: true,
    images: ["jacket for kids.jpg", "jacket for kids1.jpg", "jacket for kids2.jpg", "jacket for kids3.jpg"]
  },
  {
    name: "Kids Winter Jacket - Girls",
    description: "Stylish winter jacket designed for girls. Cozy and fashionable for cold weather.",
    price: 1999,
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    bestseller: false,
    images: ["jacket for kids girl.jpg", "jacket for kids girl1.jpg", "jacket for kids girl2.jpg", "jacket for kids girl3.jpg"]
  }
];

export const uploadAssetsAndCreateProducts = async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    const createdProducts = [];
    let uploadProgress = 0;
    const totalProducts = productData.length;
    
    for (const product of productData) {
      const uploadedImages = [];
      
      // Upload each image to Cloudinary
      for (const imageName of product.images) {
        const imagePath = path.join(assetsPath, imageName);
        
        if (fs.existsSync(imagePath)) {
          try {
            const cloudinaryUrl = await uploadOnCloudinary(imagePath);
            uploadedImages.push(cloudinaryUrl);
          } catch (error) {
            console.error(`Failed to upload ${imageName}:`, error.message);
            // Use a placeholder if upload fails
            uploadedImages.push(`https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`);
          }
        } else {
          console.warn(`Image not found: ${imagePath}`);
          // Use a placeholder if image doesn't exist
          uploadedImages.push(`https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`);
        }
      }
      
      // Ensure we have exactly 4 images
      while (uploadedImages.length < 4) {
        uploadedImages.push(uploadedImages[0] || `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`);
      }
      
      // Create product with uploaded images
      const newProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subCategory: product.subCategory,
        sizes: product.sizes,
        bestseller: product.bestseller,
        image1: uploadedImages[0],
        image2: uploadedImages[1],
        image3: uploadedImages[2],
        image4: uploadedImages[3],
        date: Date.now()
      };
      
      const createdProduct = await Product.create(newProduct);
      createdProducts.push(createdProduct);
      
      uploadProgress++;
      console.log(`Progress: ${uploadProgress}/${totalProducts} - Created: ${product.name}`);
    }
    
    res.status(200).json({
      message: "Assets uploaded to Cloudinary and products created successfully",
      count: createdProducts.length,
      products: createdProducts
    });
    
  } catch (error) {
    console.error('Error uploading assets and creating products:', error);
    res.status(500).json({ 
      message: "Error uploading assets and creating products",
      error: error.message 
    });
  }
};