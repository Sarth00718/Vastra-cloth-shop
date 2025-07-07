import express from 'express';
import dotenv from 'dotenv';
import connectDB  from './config/db.js';  
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
dotenv.config();

const app = express();
app.use(cookieParser())

const PORT = process.env.PORT || 8000;

// middleware
app.use(cors({
  // origin: ["http://localhost:5173","http://localhost:5174"],
  //https://vastra-cloth-shop-frontend.onrender.com
   origin: ["https://vastra-cloth-shop-frontend.onrender.com","https://vastra-cloth-shop-admin.onrender.com"],
  credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

//localhost
app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
