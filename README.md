
# 🧥 Vastra Cloth Shop - MERN Stack E-commerce Platform

Vastra is a modern and fully responsive **MERN Stack-based e-commerce application** built for a clothing store. It supports user authentication, product browsing, cart management, checkout with Razorpay, and a complete admin dashboard for managing products and orders.

---

## 🌐 Live URLs

- **Frontend (User):** [https://vastra-cloth-shop-frontend.onrender.com](https://vastra-cloth-shop-frontend.onrender.com)
- **Backend API:** [https://vastra-cloth-shop-backend.onrender.com](https://vastra-cloth-shop-backend.onrender.com)
- **Admin Panel:** [https://vastra-cloth-shop-admin.onrender.com](https://vastra-cloth-shop-admin.onrender.com)

---

## 🧠 Project Structure

```
vastra-cloth-shop/
├── backend/             # Express API
│   ├── config/          # DB, Cloudinary, JWT config
│   ├── controllers/     # Business logic (auth, products, cart, orders)
│   ├── middlewares/     # Auth, multer
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── index.js         # Entry point
├── frontend/            # React app for users
│   └── src/
│       ├── components/  # UI components
│       ├── pages/       # Pages (Home, Cart, Product, etc.)
│       ├── context/     # Context API
│       └── main.jsx     # App entry
├── admin/               # React app for admin panel (optional)
├── public/              # Static assets
└── README.md            # Project documentation
```

---

## 🚀 Features

### 🛍️ User Side
- User registration and login with JWT
- Browse all categories of clothing
- Product detail view with multiple images
- Add to cart, remove, and quantity control
- Place orders with Razorpay integration
- View order history
- Mobile-responsive UI
- Smooth transitions and loading screen

### 🔐 Admin Side
- Secure admin login
- Add, edit, delete products
- View all orders
- Manage user roles (if needed)
- Track revenue and order details

---

## ⚙️ Tech Stack

| Tech        | Description                     |
|-------------|----------------------------------|
| MongoDB     | NoSQL database                   |
| Express.js  | Web server for backend API       |
| React       | Frontend library (user/admin)    |
| Node.js     | Backend runtime environment      |
| Razorpay    | Payment integration              |
| Cloudinary  | Image hosting                    |
| Multer      | File upload middleware           |
| JWT         | Authentication                   |
| Vite        | React bundler                    |
| Firebase    | Google Authentication            |
| Render      | Deployment (frontend/backend)    |

---

## 🔧 Installation & Setup

> ⚠️ Make sure you have **Node.js**, **MongoDB**, and **npm** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Sarth00718/vastra-cloth-shop.git
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Panel Setup (Optional)
```bash
cd admin
npm install
npm run dev
```

---

## 📦 API Endpoints Overview

- `POST /api/auth/register` – Register a user
- `POST /api/auth/login` – User login
- `GET /api/products` – Get all products
- `GET /api/products/:id` – Product details
- `POST /api/cart` – Add to cart
- `POST /api/orders` – Place order
- `GET /api/user/orders` – User's order history
- ... and more in `routes/`

---

## 👨‍💻 Developer

**Sarth Narola**  
📍 Surat, Gujarat, India  
📧 sarthnarola007@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/sarth-narola-223002323/)  
💻 [GitHub](https://github.com/Sarth00718)

---

## 📄 License

This project is licensed under the **MIT License**.

---

> ⭐ Don’t forget to star the repository if you found this helpful!
