// product.js - Product page functionality

// ========== NOTIFICATION SYSTEM - DEFINED FIRST ==========
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showSizeSelectedNotification(size) {
    showNotification(`Size ${size} selected`, 'info');
}

// ========== MAIN PRODUCT PAGE FUNCTION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product page loaded');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        console.error('Product ID not found');
        showNotification('Product not found. Redirecting...', 'error');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 1500);
        return;
    }
    
    if (!products) {
        console.error('Products array not found');
        showNotification('Error loading product. Please refresh.', 'error');
        return;
    }
    
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('Product not found. Redirecting...', 'error');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 1500);
        return;
    }
    
    // Display product details
    displayProductDetails(product);
    
    // Setup size selection
    setupSizeSelection(product);
    
    // Setup add to cart button
    setupAddToCart(product);
    
    // Load related products
    loadRelatedProducts(productId);
    
    // Add to recently viewed
    addToRecentlyViewed(product);
    
    // Setup image zoom on hover
    setupImageZoom();
});

// ========== DISPLAY PRODUCT DETAILS ==========
function displayProductDetails(product) {
    const nameElement = document.getElementById('product-name');
    const priceElement = document.getElementById('product-price');
    const imageElement = document.getElementById('product-image');
    const badgeElement = document.getElementById('product-badge');
    
    if (nameElement) {
        nameElement.style.opacity = '0';
        nameElement.textContent = product.name;
        setTimeout(() => {
            nameElement.style.transition = 'opacity 0.5s ease';
            nameElement.style.opacity = '1';
        }, 100);
    }
    
    if (priceElement) {
        priceElement.style.opacity = '0';
        priceElement.textContent = `₵${product.price.toLocaleString()}`;
        setTimeout(() => {
            priceElement.style.transition = 'opacity 0.5s ease';
            priceElement.style.opacity = '1';
        }, 200);
    }
    
    if (imageElement) {
        imageElement.style.opacity = '0';
        imageElement.src = product.image;
        imageElement.alt = product.name;
        
        imageElement.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
        
        imageElement.onload = function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        };
    }
    
    // Set badge if exists
    if (badgeElement && product.badge) {
        badgeElement.textContent = product.badge;
        badgeElement.style.display = 'block';
    } else if (badgeElement) {
        badgeElement.style.display = 'none';
    }
    
    // Update page title
    document.title = `Amen+ | ${product.name}`;
}

// ========== SIZE SELECTION ==========
function setupSizeSelection(product) {
    const sizeOptions = document.getElementById('size-options');
    const sizeGuideLink = document.querySelector('.size-guide-link a');
    
    if (!sizeOptions || !product.sizes) return;
    
    // Clear any existing buttons
    sizeOptions.innerHTML = '';
    
    // Create size buttons
    product.sizes.forEach((size, index) => {
        const button = document.createElement('button');
        button.className = 'size-btn';
        button.dataset.size = size;
        button.textContent = size;
        
        // Add animation delay
        button.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.1}s`;
        button.style.opacity = '0';
        
        sizeOptions.appendChild(button);
    });
    
    // Handle size selection
    let selectedSize = null;
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            sizeButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            selectedSize = this.dataset.size;
            
            // Show selected size notification
            showSizeSelectedNotification(selectedSize);
        });
    });
    
    // Setup size guide link
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSizeGuide();
        });
    }
}

// ========== ADD TO CART ==========
function setupAddToCart(product) {
    const addToCartBtn = document.getElementById('add-to-cart');
    
    if (!addToCartBtn) return;
    
    // Remove any existing event listeners
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get selected size
        const activeSizeBtn = document.querySelector('.size-btn.active');
        
        if (!activeSizeBtn) {
            showNotification('Please select a size first!', 'warning');
            // Highlight size options
            const sizeSection = document.querySelector('.size-selection');
            if (sizeSection) {
                sizeSection.classList.add('highlight');
                setTimeout(() => {
                    sizeSection.classList.remove('highlight');
                }, 1000);
            }
            return;
        }
        
        const selectedSize = activeSizeBtn.dataset.size;
        
        // Button loading animation
        const originalText = newBtn.innerHTML;
        newBtn.classList.add('loading');
        newBtn.disabled = true;
        newBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        
        setTimeout(() => {
            if (typeof window.addToCart === 'function') {
                window.addToCart(product.id, selectedSize);
                
                // Success animation
                newBtn.classList.remove('loading');
                newBtn.classList.add('success');
                newBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    newBtn.classList.remove('success');
                    newBtn.innerHTML = originalText;
                    newBtn.disabled = false;
                }, 2000);
                
                // Trigger confetti effect
                triggerAddToCartConfetti();
                
            } else {
                showNotification('Cart system not loaded. Please refresh page.', 'error');
                newBtn.classList.remove('loading');
                newBtn.innerHTML = originalText;
                newBtn.disabled = false;
            }
        }, 500);
    });
}

// ========== RELATED PRODUCTS ==========
function loadRelatedProducts(currentProductId) {
    const relatedContainer = document.getElementById('related-products');
    
    if (!relatedContainer || !products) return;
    
    // Filter out current product
    const otherProducts = products.filter(p => p.id !== currentProductId);
    
    // Shuffle and pick 4
    const related = otherProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    if (related.length === 0) {
        relatedContainer.innerHTML = '<p class="no-related">No related products found</p>';
        return;
    }
    
    // Clear container
    relatedContainer.innerHTML = '';
    
    // Add related products
    related.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
        card.style.opacity = '0';
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="quick-view">Quick View</span>
            </div>
            <h3>${product.name}</h3>
            <p class="price">₵${product.price.toLocaleString()}</p>
            <a href="product.html?id=${product.id}" class="view-product">
                <i class="fas fa-eye"></i> View Details
            </a>
        `;
        
        // Add hover effect for quick view
        const imgWrapper = card.querySelector('.product-image-wrapper');
        const quickView = card.querySelector('.quick-view');
        
        imgWrapper.addEventListener('mouseenter', () => {
            quickView.style.opacity = '1';
        });
        
        imgWrapper.addEventListener('mouseleave', () => {
            quickView.style.opacity = '0';
        });
        
        relatedContainer.appendChild(card);
    });
}

// ========== RECENTLY VIEWED ==========
function addToRecentlyViewed(product) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
    
    // Add to beginning
    recentlyViewed.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    });
    
    // Keep only last 5
    if (recentlyViewed.length > 5) {
        recentlyViewed = recentlyViewed.slice(0, 5);
    }
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// ========== IMAGE ZOOM ==========
function setupImageZoom() {
    const imageContainer = document.querySelector('.product-image');
    const image = document.getElementById('product-image');
    
    if (!imageContainer || !image) return;
    
    imageContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        image.style.transform = `scale(1.5)`;
        image.style.transformOrigin = `${x}% ${y}%`;
    });
    
    imageContainer.addEventListener('mouseleave', function() {
        image.style.transform = 'scale(1)';
        image.style.transformOrigin = 'center center';
    });
}

// ========== SIZE GUIDE MODAL ==========
function showSizeGuide() {
    // Remove existing modal if any
    const existingModal = document.getElementById('size-guide-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'size-guide-modal';
    modal.className = 'size-guide-modal';
    modal.innerHTML = `
        <div class="size-guide-content">
            <span class="close-size-guide">&times;</span>
            <h2><i class="fas fa-ruler"></i> Size Guide</h2>
            <p class="size-guide-subtitle">Find your perfect fit</p>
            
            <div class="size-guide-tabs">
                <button class="size-tab active" data-tab="men">Men</button>
                <button class="size-tab" data-tab="women">Women</button>
                <button class="size-tab" data-tab="unisex">Unisex</button>
            </div>
            
            <div class="size-tab-content active" id="men-tab">
                <table class="size-table">
                    <thead>
                        <tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Length (cm)</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>S</td><td>91-96</td><td>76-81</td><td>71</td></tr>
                        <tr><td>M</td><td>96-101</td><td>81-86</td><td>74</td></tr>
                        <tr><td>L</td><td>101-106</td><td>86-91</td><td>76</td></tr>
                        <tr><td>XL</td><td>106-112</td><td>91-97</td><td>79</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="size-tab-content" id="women-tab">
                <table class="size-table">
                    <thead>
                        <tr><th>Size</th><th>Bust (cm)</th><th>Waist (cm)</th><th>Hip (cm)</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>XS</td><td>81-86</td><td>61-66</td><td>86-91</td></tr>
                        <tr><td>S</td><td>86-91</td><td>66-71</td><td>91-96</td></tr>
                        <tr><td>M</td><td>91-96</td><td>71-76</td><td>96-101</td></tr>
                        <tr><td>L</td><td>96-101</td><td>76-81</td><td>101-106</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="size-tab-content" id="unisex-tab">
                <table class="size-table">
                    <thead>
                        <tr><th>Size</th><th>Chest (cm)</th><th>Length (cm)</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>S</td><td>91-96</td><td>71</td></tr>
                        <tr><td>M</td><td>96-101</td><td>74</td></tr>
                        <tr><td>L</td><td>101-106</td><td>76</td></tr>
                        <tr><td>XL</td><td>106-112</td><td>79</td></tr>
                    </tbody>
                </table>
            </div>
            
            <p class="size-note">
                <i class="fas fa-info-circle"></i>
                For hoodies, add 5cm to chest measurements for comfortable fit
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-size-guide');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Tab functionality
    const tabs = modal.querySelectorAll('.size-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab') + '-tab';
            modal.querySelectorAll('.size-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Close on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// ========== CONFETTI EFFECT ==========
function triggerAddToCartConfetti() {
    const colors = ['#D4AF37', '#5C3A2D', '#8B6B4D', '#FFFFFF'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear`;
        
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}