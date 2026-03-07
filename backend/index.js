const express = require('express');
const mongoose = require('mongoose');
const User = require('./Models/User');
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config();
const Product = require('./Models/Product');
const slugify = require('slugify');
const multer = require('multer');
const path = require('path');
const ContactUs = require('./Models/ContactUs');
const Order = require('./Models/Order');
const Review = require('./Models/Review');
const axios = require('axios');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Settings = require('./Models/Settings');

const app = express();
const PORT = process.env.PORT || 5002;


// Memory monitoring
setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory usage: ${Math.round(used * 100) / 100} MB`);
}, 10000);

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// File uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harrishere:Haris123@tododb.qyf9c.mongodb.net/clothingweb?retryWrites=true&w=majority&appName=Tododb';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected!');
});

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API 🚀');
});


app.post('/signup', async (req, res) => {
  const { name, age, username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, age, username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
})




app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
})


app.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'logged out successfully' });
});

// ================================
// FORGOT PASSWORD - OTP FLOW
// ================================

// Step 1: Send OTP to email
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpiry = expiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - E-Commerce',
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #667eea;">Password Reset Request</h2>
                    <p>You requested a password reset. Use the OTP below to reset your password:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #764ba2; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
                    </div>
                    <p style="color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
                    <p style="color: #666;">If you did not request this, please ignore this email.</p>
                </div>
            `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Step 2: Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Step 3: Reset Password
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});





app.post('/dashboard/add-product', upload.array('images', 10), async (req, res) => {
  let { name, description, originalPrice, discountedPrice, category, stock } = req.body;
  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

  try {
    category = category.toLowerCase().trim();
    const slug = slugify(name, { lower: true, strict: true }); // ✅ Convert to slug

    const newProduct = new Product({
      name,
      description,
      originalPrice,
      discountedPrice,
      image: imagePaths,
      category,
      stock,
      slug
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});








app.get('/catalog', async (req, res) => {
  try {
    console.log('Fetching products from database...');
    const products = await Product.find();
    console.log('Products found:', products); // Log what's actually returned

    if (!Array.isArray(products)) {
      console.error('Products is not an array:', typeof products);
      return res.status(500).json({ error: 'Unexpected data format', data: [] });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('Error in /catalog:', err);
    res.status(500).json({ error: 'Failed to fetch products', data: [] });
  }
});



app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});





app.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase().trim(); // ✅ Normalize input

  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching category products:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});




app.get('/product/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get reviews and calculate average rating
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

    res.json({
      ...product.toObject(),
      reviews,
      averageRating: averageRating.toFixed(1),
      reviewCount: reviews.length
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});



app.post('/contactUs', async (req, res) => {
  const { name, email, subject, message } = req.body
  try {
    const contactUs = new ContactUs({ name, email, subject, message })
    await contactUs.save()
    res.status(201).json({ message: "Message sent successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server Error" })
  }
})

app.get('/contactus/show', async (req, res) => {
  try {
    const messages = await ContactUs.find()
    res.status(200).json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server Error" })
  }
})


app.post('/contactus/reply', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


app.get('/new-arrival', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);



    const products = await Product.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);



    res.json(products);
  } catch (err) {

    res.status(500).json({ error: "Server Error" });
  }
});



app.get('/search', async (req, res) => {
  try {
    let { query } = req.query;
    console.log('Search query:', query);
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    query = query.trim().toLowerCase();
    const keywords = query.split(/\s+/);

    const regexConditions = keywords.flatMap((word) => [
      { name: { $regex: new RegExp(word, 'i') } },
      { description: { $regex: new RegExp(word, 'i') } },
      { category: { $regex: new RegExp(word, 'i') } }
    ]);

    const products = await Product.find({ $or: regexConditions }).limit(20);

    if (products.length === 0) {
      console.log('No matches found for:', keywords);
    }

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});









app.post('/orders', async (req, res) => {
  try {
    const { customerName, email, phone, address, city, zipCode, products, totalAmount } = req.body;

    const newOrder = new Order({
      customerName,
      email,
      phone,
      address,
      city,
      zipCode,
      products,
      totalAmount,
      paymentMethod: 'cash-on-delivery'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/allOrder', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const messageCount = await ContactUs.countDocuments();

    res.json({
      products: productCount,
      orders: orderCount,
      messages: messageCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ shippingCharge: 0 });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { shippingCharge } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ shippingCharge });
    } else {
      settings.shippingCharge = shippingCharge;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update order status
app.put('/allOrder/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/verify-whatsapp/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${phone}`;

    // You might want to use a proper WhatsApp Business API here
    // This is just a placeholder implementation

    res.json({
      success: true,
      hasWhatsApp: true, // In a real implementation, you'd check this
      whatsappUrl: whatsappApiUrl
    });
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});








app.get('/auth/me', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).send();
    }

    res.send({ user });
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
});





// Get reviews for a product
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add a review and update product rating stats
app.post('/api/reviews', async (req, res) => {
  try {
    const { product, userName, userEmail, rating, comment } = req.body;

    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create the review
    const review = await Review.create({
      product,
      userName,
      userEmail,
      rating,
      comment
    });

    // Calculate new average rating and review count
    const reviews = await Review.find({ product });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / reviews.length;
    const reviewCount = reviews.length;

    // Update the product with new rating stats
    await Product.findByIdAndUpdate(product, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
});







app.put('/update/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /admin/products/:id - Delete product
app.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});












































app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    dbState: mongoose.connection.readyState,
    timestamp: new Date()
  });
});


const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
