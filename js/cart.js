// ========== CART STATE ==========
let cart = JSON.parse(localStorage.getItem('amenCart')) || [];

// Delivery zones data for Ghana
const deliveryZones = {
    'accra-primary': {
        name: 'Accra Primary Zone',
        price: 35,
        icon: '🏙️',
        areas: ['Osu', 'Cantonments', 'Ridge', 'Adabraka', 'Circle', 'Ministries', 'Kaneshie', 'Dansoman', 'Mataheko', 'Mamprobi', 'Korle Bu', 'Chorkor', 'Labadi', 'Teshie', 'Nungua', 'Dzorwulu', 'Abelemkpe', 'Achimota', 'Alajo', 'Lapaz', 'Abeka', 'Darkuman', 'Awoshie', 'Kwashieman', 'Odorkor', 'Mallam', 'Weija', 'Gbawe', 'McCarthy Hill', 'Bubuashie', 'Sakaman', 'Amasaman', 'Pokuase', 'Ablekuma', 'Kwabenya', 'Dome', 'Adenta', 'Tema Com 1-10', 'Kasoa Old Market', 'Kasoa Main', 'Kakraba', 'Galilea', 'CP', 'Opkiuma', 'Amanfrom', 'Tuba', 'Ngleshie Amanfro', 'Iron City', 'Broadcasting', 'Nyanyano', 'Adam Nana', 'Nurses Quarters', 'Ofankor', 'New Market', 'Agbogba', 'University of Ghana Campus', 'UPSA', 'Okponglo', 'Shiashie', 'North Legon', 'Legon Bypass', 'Anyaa', 'Madina', 'Haatso', 'East Legon', 'Korle Gorno', 'Banyard', 'Taifa']
    },
    'accra-extended': {
        name: 'Accra Extended Zone',
        price: 45,
        icon: '🌆',
        areas: ['Ashiaman', 'Lashibi', 'Sakumono', 'Spintex', 'Baatsona', 'Klagon', 'Manet', 'Tema Communities 11–25', 'After Kasoa New Market', 'Millennium City', 'Liberia Camp', 'Krispol City', 'Abokobi', 'Teiman Town', 'Old Barrier', 'Pantang Junction', 'Oyarifa', 'Special Ice Area', 'Pantang', 'Frafraha Melcom']
    },
    'kumasi': {
        name: 'Kumasi Zones',
        price: 48,
        icon: '⛰️',
        areas: ['Adum', 'Kejetia', 'Ashtown', 'Manhyia', 'Alarba', 'Asawase', 'Asafo', 'Stadium', 'Asokwa', 'Bantama', 'Abrepo Junction', 'Danyame', 'Patasi', 'Santasi', 'Paraku Estate', 'Adiembra', 'Ahodwo', 'Daban', 'Atonsu', 'Ahinsan', 'Gyinase', 'Chirapatre', 'Ramseyer', 'Dompoase', 'Aprabon', 'Kaase', 'Kuwait / Oti', 'Sewua', 'Esereso', 'Feyiase', 'Sofoline', 'Kwadaso', 'Asuoboyoee', 'I.P.T', 'Tanoso', 'Abuakwa', 'Adoatu', 'Adumanu', 'Abrepo', 'Anloga', 'Oforikrom', 'Aboabu', 'Sawaba', 'Sepe', 'Doti', 'Bomsu', 'Ayigya', 'Asokore-Mampong', 'KNUST', 'Boadi', 'Emena', 'Deduakoo', 'Kentinkronu', 'Oduom', 'Suame', 'Maakro', 'Anomangye', 'Tafo', 'Bremang', 'Kronum', 'Pankronu', 'Krofrom', 'Airport Residential Area', 'Boukrom', 'Duase', 'Kenyasi']
    }
};

// Delivery location state
let deliveryLocation = JSON.parse(localStorage.getItem('deliveryLocation')) || {
    zone: '',
    specificArea: '',
    zoneName: '',
    zonePrice: 0
};

// ========== SMS CONFIGURATION ==========
const SMS_CONFIG = {
    orderNumber: '0530379533',  // Confirmation SMS
    salesNumber: '0550987093',  // Melanie Finance MoMo (Payment Primary)
    deliveryNumber: '0530379533', // Delivery fees
    financeLead: 'Melanie Asante'
};

// ========== DOM ELEMENTS ==========
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    // Remove existing notifications if too many
    const existingNotifications = document.querySelectorAll('.notification');
    if (existingNotifications.length > 3) {
        existingNotifications[0].remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';
    
    notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== INITIALIZE CART ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js loaded successfully');
    initCart();
    
    // Add animation class to cart icon
    if (cartIcon) {
        cartIcon.classList.add('cart-icon-pulse');
    }
});

function initCart() {
    updateCartCount();
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Load saved delivery location
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
        deliveryLocation = JSON.parse(savedLocation);
    }
}

// ========== CART FUNCTIONS ==========
function openCart() {
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        renderCartItems();
        document.body.style.overflow = 'hidden';
        
        // Add animation to cart items
        setTimeout(() => {
            const cartItems = document.querySelectorAll('.cart-item');
            cartItems.forEach((item, index) => {
                item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
            });
        }, 100);
    }
}

function closeCartSidebar() {
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function addToCart(productId, size) {
    const product = getProductById(productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }

    if (!size) {
        showNotification('Please select a size!', 'warning');
        return;
    }

    // Check if product with same ID and size already in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && item.size === size
    );

    if (existingItemIndex > -1) {
        // Increase quantity
        cart[existingItemIndex].quantity += 1;
        showNotification(`${product.name} quantity updated!`, 'success');
    } else {
        // Add new item
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
        showNotification(`${product.name} (Size: ${size}) added to cart!`, 'success');
    }

    saveCart();
    updateCartCount();
    
    // Animate cart icon
    if (cartIcon) {
        cartIcon.classList.add('cart-bump');
        setTimeout(() => {
            cartIcon.classList.remove('cart-bump');
        }, 300);
    }
    
    // Open cart to show items
    openCart();
}

function removeFromCart(productId, size) {
    const product = cart.find(item => item.id === productId && item.size === size);
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification(`${product.name} removed from cart`, 'info');
}

function updateQuantity(productId, size, newQuantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId, size);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartItems();
            
            // Animate price update
            const priceElement = document.querySelector('.cart-total');
            if (priceElement) {
                priceElement.classList.add('price-update');
                setTimeout(() => {
                    priceElement.classList.remove('price-update');
                }, 300);
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('amenCart', JSON.stringify(cart));
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add animation to cart count
        cartCount.classList.add('count-pop');
        setTimeout(() => {
            cartCount.classList.remove('count-pop');
        }, 300);
    }
}

// ========== DELIVERY FUNCTIONS ==========
function selectDeliveryZone(zone) {
    deliveryLocation.zone = zone;
    deliveryLocation.zoneName = deliveryZones[zone].name;
    deliveryLocation.zonePrice = deliveryZones[zone].price;
    deliveryLocation.specificArea = '';
    saveDeliveryLocation();
    renderCartItems();
    
    showNotification(`${deliveryZones[zone].name} selected`, 'success');
    
    // Scroll to area selection
    setTimeout(() => {
        const areaSelect = document.getElementById('specific-area');
        if (areaSelect) {
            areaSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function selectSpecificArea(area) {
    deliveryLocation.specificArea = area;
    saveDeliveryLocation();
    updateCartTotals();
    showNotification(`Delivery area updated to ${area}`, 'info');
}

function saveDeliveryLocation() {
    localStorage.setItem('deliveryLocation', JSON.stringify(deliveryLocation));
}

function calculateDeliveryFee() {
    if (!deliveryLocation.zone) return 0;
    return deliveryLocation.zonePrice || 0;
}

// ========== CART RENDERING ==========
function renderCartItems() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
                <a href="shop.html" class="btn-shop-now" onclick="closeCartSidebar()">
                    <i class="fas fa-store"></i> Shop Now
                </a>
            </div>
        `;
        updateCartTotals();
        return;
    }

    let itemsHTML = '<div class="cart-items-list">';
    
    // Render cart items
    cart.forEach((item, index) => {
        itemsHTML += `
            <div class="cart-item" style="animation: slideIn 0.3s ease forwards ${index * 0.1}s">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-size">Size: <span>${item.size}</span></p>
                    <p class="cart-item-price">₵${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    itemsHTML += '</div>';

    // Add delivery selection section
    itemsHTML += `
        <div class="delivery-section">
            <h3><i class="fas fa-map-marker-alt"></i> Delivery Location</h3>
            <p class="delivery-subtitle">Select your delivery zone in Ghana</p>
            
            <div class="zone-options">
                <button class="zone-btn ${deliveryLocation.zone === 'accra-primary' ? 'active' : ''}" 
                        onclick="selectDeliveryZone('accra-primary')">
                    <span class="zone-icon">🏙️</span>
                    <span class="zone-info">
                        <span class="zone-name">Accra Primary Zone</span>
                        <span class="zone-price">₵35</span>
                    </span>
                </button>
                
                <button class="zone-btn ${deliveryLocation.zone === 'accra-extended' ? 'active' : ''}" 
                        onclick="selectDeliveryZone('accra-extended')">
                    <span class="zone-icon">🌆</span>
                    <span class="zone-info">
                        <span class="zone-name">Accra Extended Zone</span>
                        <span class="zone-price">₵45</span>
                    </span>
                </button>
                
                <button class="zone-btn ${deliveryLocation.zone === 'kumasi' ? 'active' : ''}" 
                        onclick="selectDeliveryZone('kumasi')">
                    <span class="zone-icon">⛰️</span>
                    <span class="zone-info">
                        <span class="zone-name">Kumasi Zones</span>
                        <span class="zone-price">₵48</span>
                    </span>
                </button>
            </div>
            
            ${deliveryLocation.zone ? `
            <div class="area-selection">
                <label for="specific-area">
                    <i class="fas fa-location-dot"></i> Select your specific area:
                </label>
                <select id="specific-area" onchange="selectSpecificArea(this.value)" class="area-select">
                    <option value="">-- Choose your area --</option>
                    ${deliveryZones[deliveryLocation.zone].areas.map(area => `
                        <option value="${area}" ${deliveryLocation.specificArea === area ? 'selected' : ''}>${area}</option>
                    `).join('')}
                </select>
                <p class="area-note">
                    <i class="fas fa-info-circle"></i> 
                    Selecting your exact area ensures accurate delivery
                </p>
            </div>
            ` : ''}
            
            <div class="delivery-timeline">
                <i class="fas fa-clock"></i>
                <div class="timeline-info">
                    <strong>Delivery Timeline:</strong>
                    <span>48-72 hours after order confirmation</span>
                </div>
            </div>
        </div>
    `;

    cartItemsContainer.innerHTML = itemsHTML;
    updateCartTotals();
}

function updateCartTotals() {
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate delivery fee
    const deliveryFee = calculateDeliveryFee();
    
    // Calculate grand total
    const grandTotal = subtotal + deliveryFee;
    
    // Update display
    const subtotalElement = document.getElementById('cart-subtotal');
    const deliveryElement = document.getElementById('delivery-fee');
    const grandTotalElement = document.getElementById('grand-total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `₵${subtotal.toLocaleString()}`;
        subtotalElement.classList.add('price-update');
        setTimeout(() => subtotalElement.classList.remove('price-update'), 300);
    }
    
    if (deliveryElement) {
        deliveryElement.textContent = deliveryFee > 0 ? `₵${deliveryFee}` : 'Not selected';
        deliveryElement.classList.add('price-update');
        setTimeout(() => deliveryElement.classList.remove('price-update'), 300);
    }
    
    if (grandTotalElement) {
        grandTotalElement.textContent = `₵${grandTotal.toLocaleString()}`;
        grandTotalElement.classList.add('price-update');
        setTimeout(() => grandTotalElement.classList.remove('price-update'), 300);
    }
}

// ========== SHOW SMS INSTRUCTIONS AFTER PAYMENT ==========
function showSMSInstructions(orderDetails) {
    // Create modal for SMS instructions
    const smsModal = document.createElement('div');
    smsModal.className = 'sms-modal';
    smsModal.innerHTML = `
        <div class="sms-modal-content">
            <span class="close-sms-modal">&times;</span>
            <div class="sms-modal-header">
                <i class="fas fa-check-circle" style="color: #28a745; font-size: 4rem;"></i>
                <h2>✅ PAYMENT SUCCESSFUL!</h2>
            </div>
            
            <div class="sms-instructions">
                <p>Thank you for your order, <strong>${orderDetails.customerName}</strong>!</p>
                
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <p><strong>Order #:</strong> ${orderDetails.reference}</p>
                    <p><strong>Items:</strong> ${orderDetails.itemCount}</p>
                    <p><strong>Total:</strong> ₵${orderDetails.totalAmount}</p>
                    <p><strong>Delivery:</strong> ${orderDetails.deliveryArea}</p>
                </div>
                
                <div class="sms-action">
                    <h3>📱 PLEASE SEND THIS SMS</h3>
                    <p>To confirm your order, send the following message to:</p>
                    <div class="sms-number">${SMS_CONFIG.orderNumber}</div>
                    
                    <div class="sms-message-box">
                        <p><strong>Copy this exact message:</strong></p>
                        <div class="sms-message">
                            Order #${orderDetails.reference}<br>
                            Name: ${orderDetails.customerName}<br>
                            Items: ${orderDetails.itemCount}<br>
                            Total: ₵${orderDetails.totalAmount}<br>
                            Delivery: ${orderDetails.deliveryArea}
                        </div>
                        <button class="copy-sms-btn" onclick="copySMSText('Order #${orderDetails.reference}\nName: ${orderDetails.customerName}\nItems: ${orderDetails.itemCount}\nTotal: ₵${orderDetails.totalAmount}\nDelivery: ${orderDetails.deliveryArea}')">
                            <i class="fas fa-copy"></i> Copy Message
                        </button>
                    </div>
                    
                    <div class="sms-note">
                        <i class="fas fa-info-circle"></i>
                        <p>We'll confirm your order within 30 minutes after receiving your SMS.</p>
                    </div>
                </div>
                
                <div class="sms-help">
                    <p><strong>Questions?</strong> Call our Finance Lead, <strong>Melanie Asante</strong>, on <a href="tel:${SMS_CONFIG.salesNumber}">${SMS_CONFIG.salesNumber}</a></p>
                </div>
            </div>
            
            <button class="sms-close-btn" onclick="closeSMSModal()">Got it, I'll send the SMS</button>
        </div>
    `;
    
    document.body.appendChild(smsModal);
    
    // Show modal
    setTimeout(() => {
        smsModal.style.display = 'flex';
    }, 100);
    
    // Close modal functionality
    const closeBtn = smsModal.querySelector('.close-sms-modal');
    closeBtn.addEventListener('click', closeSMSModal);
    
    // Close on outside click
    smsModal.addEventListener('click', function(e) {
        if (e.target === smsModal) {
            closeSMSModal();
        }
    });
}

// Global function to close SMS modal
function closeSMSModal() {
    const modal = document.querySelector('.sms-modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Global function to copy SMS text
window.copySMSText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('SMS copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Please copy the message manually', 'info');
    });
};

// ========== CHECKOUT WITH PAYSTACK ==========
function checkout() {
    // Validate cart
    if (cart.length === 0) {
        showNotification('Your cart is empty! Please add items before checkout.', 'error');
        return;
    }
    
    // Validate delivery location
    if (!deliveryLocation.zone) {
        showNotification('Please select a delivery zone first!', 'warning');
        const zoneSection = document.querySelector('.zone-options');
        if (zoneSection) {
            zoneSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }
    
    // Show branded checkout modal instead of browser prompts
    showCheckoutModal();
}

// ========== CHECKOUT MODAL ==========
function showCheckoutModal() {
    // Remove any existing modal
    const existing = document.getElementById('checkout-modal');
    if (existing) existing.remove();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = calculateDeliveryFee();
    const totalAmount = subtotal + deliveryFee;

    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'display:flex', 'align-items:center', 'justify-content:center',
        'background:rgba(0,0,0,0.65)', 'backdrop-filter:blur(6px)',
        'padding:20px', 'animation:fadeIn 0.2s ease'
    ].join(';');

    modal.innerHTML = `
        <div style="
            background:#fff;
            border-radius:24px;
            width:100%;
            max-width:480px;
            box-shadow:0 30px 80px rgba(92,58,45,0.35);
            overflow:hidden;
            animation:slideUp 0.3s ease;
            font-family:'Inter',sans-serif;
        ">
            <!-- Modal Header -->
            <div style="
                background:linear-gradient(135deg,#5C3A2D,#8B6B4D);
                padding:28px 32px;
                text-align:center;
                position:relative;
            ">
                <button onclick="closeCheckoutModal()" style="
                    position:absolute;top:16px;right:16px;
                    background:rgba(255,255,255,0.15);border:none;
                    color:white;width:32px;height:32px;border-radius:50%;
                    font-size:1.2rem;cursor:pointer;display:flex;
                    align-items:center;justify-content:center;
                    transition:background 0.2s;
                " onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">&times;</button>
                <div style="font-size:2rem;margin-bottom:8px;">✝</div>
                <h2 style="color:white;font-family:'Playfair Display',serif;font-size:1.6rem;margin:0 0 4px;">Complete Your Order</h2>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:0.9rem;">Secured by Paystack</p>
            </div>

            <!-- Order Summary -->
            <div style="
                background:#FDF6F0;
                padding:16px 32px;
                display:flex;justify-content:space-between;
                font-size:0.9rem;color:#5C3A2D;
            ">
                <span><strong>${cart.reduce((s,i) => s + i.quantity, 0)}</strong> item${cart.reduce((s,i) => s + i.quantity, 0) !== 1 ? 's' : ''} &nbsp;|&nbsp; Delivery: <strong>₵${deliveryFee > 0 ? deliveryFee : 'TBD'}</strong></span>
                <span style="font-weight:700;color:#D4AF37;font-size:1rem;">₵${totalAmount.toLocaleString()}</span>
            </div>

            <!-- Form -->
            <form id="checkout-form" style="padding:28px 32px;" onsubmit="submitCheckoutForm(event)">
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;color:#5C3A2D;margin-bottom:8px;">
                        <i class="fas fa-user" style="color:#D4AF37;margin-right:6px;"></i> Full Name *
                    </label>
                    <input id="co-name" type="text" placeholder="e.g. Kofi Mensah" required
                        style="
                            width:100%;padding:13px 16px;
                            border:2px solid rgba(212,175,55,0.3);
                            border-radius:12px;font-size:1rem;
                            font-family:'Inter',sans-serif;
                            outline:none;transition:border-color 0.2s;
                            box-sizing:border-box;
                        "
                        onfocus="this.style.borderColor='#D4AF37'" onblur="this.style.borderColor='rgba(212,175,55,0.3)'">
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;color:#5C3A2D;margin-bottom:8px;">
                        <i class="fas fa-phone" style="color:#D4AF37;margin-right:6px;"></i> Phone Number *
                    </label>
                    <input id="co-phone" type="tel" placeholder="e.g. 0201234567" required
                        style="
                            width:100%;padding:13px 16px;
                            border:2px solid rgba(212,175,55,0.3);
                            border-radius:12px;font-size:1rem;
                            font-family:'Inter',sans-serif;
                            outline:none;transition:border-color 0.2s;
                            box-sizing:border-box;
                        "
                        onfocus="this.style.borderColor='#D4AF37'" onblur="this.style.borderColor='rgba(212,175,55,0.3)'">
                </div>

                <div style="margin-bottom:28px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;color:#5C3A2D;margin-bottom:8px;">
                        <i class="fas fa-envelope" style="color:#D4AF37;margin-right:6px;"></i> Email Address *
                    </label>
                    <input id="co-email" type="email" placeholder="e.g. kofi@example.com" required
                        style="
                            width:100%;padding:13px 16px;
                            border:2px solid rgba(212,175,55,0.3);
                            border-radius:12px;font-size:1rem;
                            font-family:'Inter',sans-serif;
                            outline:none;transition:border-color 0.2s;
                            box-sizing:border-box;
                        "
                        onfocus="this.style.borderColor='#D4AF37'" onblur="this.style.borderColor='rgba(212,175,55,0.3)'">
                </div>

                <button type="submit" id="co-submit-btn" style="
                    width:100%;padding:16px;
                    background:linear-gradient(135deg,#5C3A2D,#8B6B4D);
                    color:white;border:none;border-radius:12px;
                    font-size:1.05rem;font-weight:600;
                    font-family:'Inter',sans-serif;
                    cursor:pointer;transition:all 0.3s;
                    display:flex;align-items:center;justify-content:center;gap:10px;
                " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 25px rgba(92,58,45,0.3)'" onmouseout="this.style.transform='';this.style.boxShadow='';">
                    <i class="fas fa-lock"></i> Pay ₵${totalAmount.toLocaleString()} with Paystack
                </button>

                <p style="text-align:center;margin:16px 0 0;font-size:0.8rem;color:#8B6B4D;">
                    <i class="fas fa-shield-alt" style="color:#D4AF37;"></i>
                    Every purchase feeds the homeless in Ghana. Jesus is the <strong style="color:#D4AF37;">+</strong>
                </p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCheckoutModal(); });
    document.getElementById('co-name').focus();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.2s';
        setTimeout(() => modal.remove(), 200);
    }
}

function submitCheckoutForm(event) {
    event.preventDefault();

    const customerName = document.getElementById('co-name').value.trim();
    const customerPhone = document.getElementById('co-phone').value.trim();
    const customerEmail = document.getElementById('co-email').value.trim();

    // Basic validation
    if (!customerName || customerName.length < 2) {
        showNotification('Please enter your full name', 'warning');
        return;
    }
    if (!customerPhone || !/^[0-9+\s\-]{7,15}$/.test(customerPhone)) {
        showNotification('Please enter a valid phone number', 'warning');
        return;
    }
    if (!customerEmail || !customerEmail.includes('@')) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }

    // Ask about area if not selected
    if (!deliveryLocation.specificArea) {
        if (!window.confirm('You haven\'t selected a specific area. Continue with general zone delivery?')) {
            closeCheckoutModal();
            const areaSelect = document.getElementById('specific-area');
            if (areaSelect) areaSelect.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    }

    // Disable submit button to prevent double-submit
    const submitBtn = document.getElementById('co-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Paystack...';
    }

    closeCheckoutModal();
    processPaystackPayment(customerName, customerPhone, customerEmail);
}

function processPaystackPayment(customerName, customerPhone, customerEmail) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = calculateDeliveryFee();
    const totalAmount = subtotal + deliveryFee;

    const metadata = {
        custom_fields: [
            { display_name: 'Delivery Zone', variable_name: 'delivery_zone', value: deliveryLocation.zoneName || 'Not selected' },
            { display_name: 'Delivery Area', variable_name: 'delivery_area', value: deliveryLocation.specificArea || 'Not specified' },
            { display_name: 'Delivery Fee', variable_name: 'delivery_fee', value: `₵${deliveryFee}` },
            { display_name: 'Items Count', variable_name: 'items_count', value: cart.length.toString() },
            { display_name: 'Customer Phone', variable_name: 'customer_phone', value: customerPhone },
            { display_name: 'Customer Name', variable_name: 'customer_name', value: customerName }
        ],
        cart_items: cart.map(item => ({ name: item.name, size: item.size, quantity: item.quantity, price: item.price }))
    };

    showNotification('Opening secure payment...', 'info');

    // Use config.js public key if available, fallback to inline
    const paystackKey = (window.AMEN_CONFIG && window.AMEN_CONFIG.paystackPublicKey)
        || 'pk_test_802197895cbf5302a65ee707342b8e1930f2961a';

    const handler = PaystackPop.setup({
        key: paystackKey,
        email: customerEmail,
        amount: Math.round(totalAmount * 100),
        currency: 'GHS',
        ref: 'AMEN-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        metadata,
        callback: function(response) {
            showNotification('Payment successful! Melanie Asante will confirm your order shortly.', 'success');

            const orderDetails = {
                reference: response.reference,
                customerName,
                itemCount: cart.length,
                totalAmount,
                deliveryArea: deliveryLocation.specificArea || deliveryLocation.zoneName
            };

            saveOrderToBackend({
                reference: response.reference,
                customerName,
                customerPhone,
                customerEmail,
                items: cart,
                totalAmount,
                deliveryFee,
                deliveryZone: deliveryLocation.zoneName,
                deliveryArea: deliveryLocation.specificArea || 'Not specified'
            });

            verifyPaymentAndSendSMS(response.reference);
            showSMSInstructions(orderDetails);

            // Clear cart
            cart = [];
            deliveryLocation = { zone: '', specificArea: '', zoneName: '', zonePrice: 0 };
            saveCart();
            saveDeliveryLocation();
            updateCartCount();
            closeCartSidebar();
            celebratePayment();
        },
        onClose: function() {
            showNotification('Payment window closed. You can complete your order anytime.', 'info');
        }
    });

    closeCartSidebar();
    handler.openIframe();
}

window.closeCheckoutModal = closeCheckoutModal;
window.submitCheckoutForm = submitCheckoutForm;

// ========== CELEBRATION FUNCTION ==========
function celebratePayment() {
    // Create celebration element
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = '🎉 Thank You! 🎉';
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        celebration.classList.remove('show');
        setTimeout(() => celebration.remove(), 300);
    }, 3000);
    
    // Simple confetti effect
    const colors = ['#D4AF37', '#5C3A2D', '#8B6B4D', '#FFFFFF'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// ========== HELPER FUNCTIONS ==========
function getProductById(id) {
    if (typeof products !== 'undefined') {
        return products.find(product => product.id === id);
    }
    console.error('Products array not found');
    return null;
}

// ========== BACKEND ORDER SAVING (ADDED - NO EXISTING CODE CHANGED) ==========
// API endpoint for saving orders (change to your actual server URL when deployed)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://amenplusgh.onrender.com/api';

// Function to save order to backend
// Function to save order to backend
function saveOrderToBackend(orderData) {
    fetch(`${API_BASE_URL}/orders`, {  // changed /order to /orders
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Order saved to database:', data.order);
        } else {
            console.error('Failed to save order:', data.message);
        }
    })
    .catch(error => {
        console.warn('Backend not available. Order saved locally only.', error);
    });
}

// 🆕 NEW FUNCTION: Verify Paystack payment + Send SMS receipt
function verifyPaymentAndSendSMS(reference) {
    fetch(`${API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: reference })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Payment verified & SMS receipt sent');
        } else {
            console.warn('Payment verification failed:', data.error);
        }
    })
    .catch(error => {
        console.warn('Verification error:', error);
    });
}

// Make new function globally available
window.verifyPaymentAndSendSMS = verifyPaymentAndSendSMS;