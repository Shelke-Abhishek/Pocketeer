require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas & Models
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

const reviewSchema = new mongoose.Schema({}, { strict: false });
const Review = mongoose.model('Review', reviewSchema);

const blogSchema = new mongoose.Schema({}, { strict: false });
const Blog = mongoose.model('Blog', blogSchema);

const settingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.model('Settings', settingsSchema);

// Configure Cloudinary
cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pocketeer_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
    },
});
const upload = multer({ storage: storage });

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.ADMIN_PASSWORD || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Admin Auth
const auth = (req, res, next) => {
    if (req.session && req.session.isAdmin) return next();
    res.redirect('/login');
};

async function getSettings() {
    const s = await Settings.findOne({ key: 'global' }).lean();
    return s || {};
}

// Login Routes
app.get('/login', async (req, res) => {
    res.render('login', { settings: await getSettings(), error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && (password === process.env.ADMIN_PASS || password === process.env.ADMIN_PASSWORD)) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { settings: await getSettings(), error: 'Invalid credentials' });
    }
});

// Public Routes
app.get('/', async (req, res) => {
    const products = await Product.find({}).lean();
    const settings = await getSettings();
    const reviews = await Review.find({}).lean();
    res.render('index', { products, settings, reviews });
});

app.get('/product/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) return res.status(404).send('Product not found');
    const settings = await getSettings();
    const reviews = await Review.find({ productId: product.id }).lean();
    res.render('product', { product, reviews, settings });
});

app.post('/product/:id/review', async (req, res) => {
    const { name, rating, comment } = req.body;
    if (name && rating && comment) {
        await Review.create({
            productId: req.params.id,
            name,
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString()
        });
    }
    res.redirect(`/product/${req.params.id}`);
});

app.get('/redirect', async (req, res) => {
    const product = await Product.findOne({ id: req.query.id }).lean();
    if (product && product.realLink) res.redirect(product.realLink);
    else res.status(404).send('Link not found');
});

app.get('/blog', async (req, res) => {
    const settings = await getSettings();
    const blogs = await Blog.find({}).lean();
    const reviews = await Review.find({}).lean();
    res.render('blog', { settings, blogs, reviews });
});

app.get('/blog/:id', async (req, res) => {
    const settings = await getSettings();
    const post = await Blog.findOne({ id: req.params.id }).lean();
    const reviews = await Review.find({}).lean();
    if (post) {
        res.render('blog_post', { settings, post, reviews });
    } else {
        res.redirect('/blog');
    }
});

// Admin Routes
app.get('/admin', auth, async (req, res) => {
    const products = await Product.find({}).lean();
    const settings = await getSettings();
    const reviews = await Review.find({}).lean();
    res.render('admin', { products, settings, reviews });
});

app.get('/admin/logout', async (req, res) => {
    req.session.destroy();
    const settings = await getSettings();
    res.render('logout', { settings });
});

app.post('/admin/review/delete', auth, async (req, res) => {
    await Review.deleteOne({ productId: req.body.id, date: req.body.date });
    res.redirect('/admin');
});

app.post('/admin/product/delete', auth, async (req, res) => {
    await Product.deleteOne({ id: req.body.id });
    res.redirect('/admin');
});

app.post('/admin/product', auth, upload.single('imageFile'), async (req, res) => {
    const { name, category, realLink, shortDesc, fullReview, imageUrl } = req.body;
    // Multer-Cloudinary returns req.file.path as the secure URL
    const image = req.file ? req.file.path : (imageUrl || '');
    
    await Product.create({
        id: 'prod-' + Date.now(),
        name,
        category,
        realLink,
        shortDesc,
        fullReview,
        image
    });
    res.redirect('/admin');
});

app.post('/admin/product/edit', auth, upload.single('imageFile'), async (req, res) => {
    const { id, name, category, realLink, shortDesc, fullReview, imageUrl } = req.body;
    let updateData = { name, category, realLink, shortDesc, fullReview };
    
    if (req.file) updateData.image = req.file.path;
    else if (imageUrl) updateData.image = imageUrl;

    await Product.updateOne({ id }, { $set: updateData });
    res.redirect('/admin');
});

app.post('/admin/review/edit', auth, async (req, res) => {
    const { oldProductId, oldDate, name, rating, comment } = req.body;
    await Review.updateOne(
        { productId: oldProductId, date: oldDate },
        { $set: { name, rating: parseInt(rating), comment } }
    );
    res.redirect('/admin');
});

app.post('/admin/settings', auth, upload.fields([
    {name: 'logo', maxCount: 1}, 
    {name: 'bannerDesktop', maxCount: 1},
    {name: 'bannerTablet', maxCount: 1},
    {name: 'bannerMobile', maxCount: 1}
]), async (req, res) => {
    let updateData = {};
    if (req.files['logo']) updateData.logo = req.files['logo'][0].path;
    if (req.files['bannerDesktop']) updateData.bannerDesktop = req.files['bannerDesktop'][0].path;
    if (req.files['bannerTablet']) updateData.bannerTablet = req.files['bannerTablet'][0].path;
    if (req.files['bannerMobile']) updateData.bannerMobile = req.files['bannerMobile'][0].path;
    
    await Settings.findOneAndUpdate({ key: 'global' }, { $set: updateData }, { upsert: true });
    res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
