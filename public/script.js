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


});