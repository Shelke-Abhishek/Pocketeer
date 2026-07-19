const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for Migration'))
  .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    image: String,
    realLink: String,
    shortDesc: String,
    fullReview: String
}, { strict: false });
const Product = mongoose.model('Product', productSchema);

const reviewSchema = new mongoose.Schema({
    productId: String,
    name: String,
    rating: Number,
    comment: String,
    date: String
}, { strict: false });
const Review = mongoose.model('Review', reviewSchema);

const blogSchema = new mongoose.Schema({
    id: String,
    title: String,
    snippet: String,
    content: String,
    date: String,
    image: String
}, { strict: false });
const Blog = mongoose.model('Blog', blogSchema);

const settingsSchema = new mongoose.Schema({
    key: String,
    logo: String,
    bannerDesktop: String,
    bannerTablet: String,
    bannerMobile: String
}, { strict: false });
const Settings = mongoose.model('Settings', settingsSchema);

async function migrateData() {
    try {
        await Product.deleteMany({});
        await Review.deleteMany({});
        await Blog.deleteMany({});
        await Settings.deleteMany({});
        console.log('Cleared existing MongoDB data.');

        if (fs.existsSync(path.join(__dirname, 'data', 'products.json'))) {
            const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
            if (products.length > 0) { await Product.insertMany(products); console.log(`Migrated ${products.length} products.`); }
        }

        if (fs.existsSync(path.join(__dirname, 'data', 'reviews.json'))) {
            const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8'));
            if (reviews.length > 0) { await Review.insertMany(reviews); console.log(`Migrated ${reviews.length} reviews.`); }
        }

        if (fs.existsSync(path.join(__dirname, 'data', 'blogs.json'))) {
            const blogs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'blogs.json'), 'utf8'));
            if (blogs.length > 0) { await Blog.insertMany(blogs); console.log(`Migrated ${blogs.length} blogs.`); }
        }

        if (fs.existsSync(path.join(__dirname, 'data', 'settings.json'))) {
            const settingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'settings.json'), 'utf8'));
            settingsData.key = 'global';
            const settingsDoc = new Settings(settingsData);
            await settingsDoc.save();
            console.log('Migrated settings.');
        }

        console.log('Migration Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrateData();
