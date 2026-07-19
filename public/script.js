document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    function setTheme(theme) {
        if (theme == "dark") {
            document.body.setAttribute('data-theme', 'dark');
            if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.removeAttribute('data-theme');
            if(themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem("theme", theme);
    }

    if (currentTheme == "dark" || (!currentTheme && prefersDarkScheme.matches)) {
        setTheme("dark");
    } else {
        setTheme("light");
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            setTheme(isDark ? "light" : "dark");
        });
    }

    // --- Sidebar Toggle ---
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('close-sidebar');

    function toggleSidebar() {
        if(sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    if(hamburger) hamburger.addEventListener('click', toggleSidebar);
    if(closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);

    // --- Search & Category Filtering ---
    const productSearch = document.getElementById('product-search');
    const fileInput = document.querySelector('input[name="imageFile"]');
    const urlInput = document.querySelector('input[name="imageUrl"]');
    
    if(fileInput && urlInput) {
        fileInput.addEventListener('change', () => {
            if(fileInput.value) urlInput.value = '';
        });
        urlInput.addEventListener('input', () => {
            if(urlInput.value) fileInput.value = '';
        });
    }
    
    // --- Mobile Search Toggle ---
    const searchTrigger = document.getElementById('search-trigger');
    const searchBack = document.getElementById('search-back-btn');
    const topNavbar = document.getElementById('top-navbar');

    if(searchTrigger && topNavbar) {
        searchTrigger.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                topNavbar.classList.add('search-active');
                if(productSearch) productSearch.focus();
            }
        });
    }
    if(searchBack && topNavbar) {
        searchBack.addEventListener('click', () => {
            topNavbar.classList.remove('search-active');
            if(productSearch) {
                productSearch.value = '';
                filterProducts();
            }
        });
    }

    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (categoryButtons.length > 0) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (window.innerWidth <= 1024) toggleSidebar(); // Close sidebar after clicking
                filterProducts();
            });
        });
    }

    if (productSearch) {
        productSearch.addEventListener('keyup', filterProducts);
    }

    function filterProducts() {
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const selectedCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : "all";
        const searchText = productSearch ? productSearch.value.toLowerCase() : "";

        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            const cardCategory = card.getAttribute('data-category');

            if ((selectedCategory === "all" || cardCategory === selectedCategory) &&
                productName.includes(searchText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // --- Smart Randomizer Popup ---
    const popup = document.getElementById('purchase-popup');
    if (popup && window.POCK_PRODUCTS && window.POCK_PRODUCTS.length > 0) {
        const names = [
            "Aaradhya", "Aanya", "Aarna", "Advika", "Ahaana", "Ananya", "Anika", "Anushka", "Avani", "Bhavya", 
            "Chhavi", "Diya", "Disha", "Esha", "Gauri", "Ira", "Isha", "Ishana", "Jiya", "Kavya", 
            "Kiara", "Kritika", "Kyra", "Lavanya", "Meera", "Myra", "Navya", "Naina", "Neha", "Nidhi",
            "Nyra", "Ojasvi", "Pari", "Pihu", "Prisha", "Rhea", "Riya", "Ruhi", "Saanvi", "Samaira", 
            "Sara", "Shanaya", "Shruti", "Sia", "Siya", "Suhana", "Tara", "Tanvi", "Trisha", "Vanya", 
            "Vidhi", "Zara", "Aarohi", "Aditi", "Amrita", "Anjali", "Ayesha", "Bhoomi", "Devika", "Divya",
            "Geeta", "Kareena", "Kavita", "Komal", "Maya", "Meghna", "Mitali", "Pooja", "Priya", "Radhika",
            "Aarav", "Advait", "Arjun", "Ayan", "Dhruv", "Ishaan", "Kabir", "Krishna", "Reyansh", "Rohan",
            "Vihaan", "Vivaan", "Yash", "Aditya", "Akash", "Amit", "Anand", "Aryan", "Dev", "Gaurav",
            "Karan", "Kunal", "Manish", "Rahul", "Raj", "Ravi", "Sahil", "Sanjay", "Varun", "Vikram"
        ];
        const times = [
            "just now", "1 min ago", "2 mins ago", "3 mins ago", "4 mins ago", "5 mins ago", "6 mins ago", "7 mins ago", 
            "8 mins ago", "9 mins ago", "10 mins ago", "11 mins ago", "12 mins ago", "13 mins ago", "14 mins ago", 
            "15 mins ago", "16 mins ago", "17 mins ago", "18 mins ago", "19 mins ago", "20 mins ago", "21 mins ago", 
            "22 mins ago", "23 mins ago", "24 mins ago", "25 mins ago", "26 mins ago", "27 mins ago", "28 mins ago", 
            "29 mins ago", "30 mins ago", "32 mins ago", "35 mins ago", "37 mins ago", "40 mins ago", "42 mins ago", 
            "45 mins ago", "48 mins ago", "50 mins ago", "55 mins ago", "1 hour ago", "2 hours ago", "3 hours ago", 
            "4 hours ago", "5 hours ago", "6 hours ago", "7 hours ago", "8 hours ago", "12 hours ago", "1 day ago"
        ];
        
        const actions = ["just bought", "grabbed"];
        
        const popupImg = document.getElementById('popup-img');
        const popupTitle = document.getElementById('popup-title');
        const popupDesc = document.getElementById('popup-desc');

        function triggerPopup() {
            // Get randoms
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomTime = times[Math.floor(Math.random() * times.length)];
            const randomProduct = window.POCK_PRODUCTS[Math.floor(Math.random() * window.POCK_PRODUCTS.length)];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];

            // Populate
            popupImg.src = randomProduct.image;
            popupTitle.innerText = randomName + " " + randomAction + "!";
            popupDesc.innerText = randomProduct.name + " • " + randomTime;
            
            // Add click listener
            popup.onclick = () => {
                window.location.href = '/product/' + randomProduct.id;
            };

            // Show
            popup.classList.add('show');

            // Hide after 5 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 5000);
        }

        // Trigger every 20 seconds
        setInterval(triggerPopup, 20000);
        
        // Trigger first one after 3 seconds
        setTimeout(triggerPopup, 3000);
    }
});