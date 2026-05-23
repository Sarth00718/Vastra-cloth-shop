import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true, index: true },
    sizes: { type: [String], required: true },
    bestseller: { type: Boolean, default: false, index: true },
    date: { type: Number, required: true },
    stock: { type: Number, default: 100, min: 0 },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for full-text search on name and description
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Compound indexes for common filter queries
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ date: -1 });

export const Product = mongoose.model('Product', productSchema);
