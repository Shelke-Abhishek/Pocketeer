# Pocketeer Project Manual

This manual explains the architecture of your website. The app is built using **Node.js** and **Express.js** for the backend, **EJS** for HTML templating, and vanilla **CSS/JavaScript** for the frontend.

## 📂 Root Directory
*   `server.js`: **The Brain.** This is your backend server. It handles all the routes (like what happens when someone visits `/blog` or `/admin`). It also handles security (login authentication), processing uploads via Multer, and reading/writing to your JSON database.
*   `package.json`: A list of all the backend dependencies (like express, multer, ejs) required to run your project.
*   `.env`: **Top Secret.** This holds your environment variables, specifically your `ADMIN_PASS`. This file should never be uploaded to GitHub.
*   `.gitignore`: Tells GitHub which files to ignore (like `.env` and `node_modules`).

## 📂 /data (Your Database)
This folder acts as your local database. `server.js` reads from and writes to these files.
*   `products.json`: Stores all product information (Title, Category, Affiliate Links, Reviews).
*   `reviews.json`: Stores all the customer reviews that scroll at the bottom of the screen.
*   `blogs.json`: Stores your SEO-optimized blog posts.
*   `settings.json`: Stores global settings like your Logo image path and desktop/mobile banner images.

## 📂 /public (Frontend Assets)
These files are sent directly to the customer's browser.
*   `style.css`: **The Paint.** All of the colors, responsive mobile design, layout grids, animations, and the CSS for the Smart Randomizer popup live here.
*   `script.js`: **The Interactivity.** Handles all frontend logic:
    *   Dark/Light Mode toggling
    *   Mobile Sidebar opening/closing
    *   Category filtering
    *   The "Smart Randomizer" popup logic (names, times, and intervals)
*   `/uploads/`: A directory where all of the product and banner images you upload from the Admin dashboard are saved.

## 📂 /views (Frontend HTML Templates)
These are EJS files. They look like HTML, but they allow `server.js` to inject dynamic database data into them before sending them to the user.
*   `index.ejs`: The main homepage (Hero banner, Category buttons, Product Grid).
*   `product.ejs`: The detailed view of a single product (Pocketeer's Take, Customer Reviews).
*   `admin.ejs`: The secret Admin Dashboard containing all the forms to upload, edit, and delete content.
*   `blog.ejs`: The main blog listing page.
*   `blog_post.ejs`: The layout for reading a specific blog article.
*   `login.ejs`: The secret page where you enter your password.
*   `success.ejs`: The page you see after logging out.
