# Zedify - MERN E-commerce Platform

A modern, full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring a sleek design, product management, and a seamless shopping experience.

## 🚀 Features

- **User Authentication**: Secure login and signup functionality.
- **Product Catalog**: Browse products with categories and search.
- **Shopping Cart**: Add/remove items and manage quantities.
- **Checkout System**: Integrated checkout process for orders.
- **Admin Dashboard**: Manage products, orders, and users.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Cloudinary Integration**: High-performance image storage and management.
- **Real-time Updates**: Interactive UI with smooth transitions.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Functional components and hooks.
- **React Router**: For client-side routing.
- **Vanilla CSS**: Custom, premium styling (no heavy frameworks).
- **Axios**: For API requests.

### Backend
- **Node.js & Express**: Robust server-side logic.
- **MongoDB**: Categorized and scalable data storage.
- **Mongoose**: Elegant ODM for MongoDB.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Multer**: For handling file uploads.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account/local instance
- Cloudinary account (for image handling)

### 1. Clone the repository
```bash
git clone https://github.com/Harisshabbir76/zedify_web.git
cd zedify_web
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the frontend application:
   ```bash
   npm start
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
