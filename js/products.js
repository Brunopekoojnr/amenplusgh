// ========================================
// AMEN+ CROSSROAD EDITION
// PRE-ORDER LAUNCH COLLECTION
// ========================================

const products = [
  {
    id: 1,
    name: "Crossroad Statement Shirt",
    price: 200,
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown"],
    image: "assets/images/IMG_1786.JPG.jpeg",
    hoverImage: "assets/images/IMG_1787.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1786.JPG.jpeg",
      "assets/images/IMG_1787.JPG.jpeg",
      "assets/images/IMG_1788.JPG.jpeg",
      "assets/images/IMG_1789.JPG.jpeg"
    ],
    description: "At every crossroad, a choice is made. This piece represents the decision to stand firm in Christ—bold in faith, clear in purpose, and unapologetic in identity.",
    features: [
      "100% Premium Combed Cotton",
      "Bold Statement Design",
      "Preshrunk Fabric",
      "Reinforced Shoulder Seams",
      "Made with Purpose in Ghana"
    ],
    careInstructions: [
      "Machine wash cold with similar colors",
      "Tumble dry low or hang to dry",
      "Iron on low heat if needed",
      "Do not bleach"
    ],
    badge: "PRE-ORDER",
    rating: 5.0,
    reviewCount: 0,
    inStock: true,
    isPreOrder: true,
    expectedDeliveryDate: "2026-05-15",
    stockQuantity: 100,
    tags: ["preorder", "shirt", "statement", "crossroads"]
  },
  {
    id: 2,
    name: "Crossroad Essential Tee",
    price: 150,
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Off-White"],
    image: "assets/images/IMG_1790.JPG.jpeg",
    hoverImage: "assets/images/IMG_1791.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1790.JPG.jpeg",
      "assets/images/IMG_1791.JPG.jpeg",
      "assets/images/IMG_1792.JPG.jpeg",
      "assets/images/IMG_1793.JPG.jpeg"
    ],
    description: "Everyday wear, eternal message. The Crossroad Tee is a reminder that no matter the path, God is at the center of it all.",
    features: [
      "100% Premium Combed Cotton",
      "Everyday Comfort Fit",
      "Preshrunk Fabric",
      "Soft Touch Finish",
      "Made with Purpose in Ghana"
    ],
    careInstructions: [
      "Machine wash cold with similar colors",
      "Tumble dry low or hang to dry",
      "Iron on low heat if needed",
      "Do not bleach"
    ],
    badge: "PRE-ORDER",
    rating: 5.0,
    reviewCount: 0,
    inStock: true,
    isPreOrder: true,
    expectedDeliveryDate: "2026-05-15",
    stockQuantity: 100,
    tags: ["preorder", "tee", "essential", "crossroads"]
  },
  {
    id: 3,
    name: "Crossroad Signature Cap",
    price: 100,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Brown"],
    image: "assets/images/IMG_1800.JPG.jpeg",
    hoverImage: "assets/images/IMG_1801.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1800.JPG.jpeg",
      "assets/images/IMG_1801.JPG.jpeg",
      "assets/images/IMG_1802.JPG.jpeg",
      "assets/images/IMG_1803.JPG.jpeg"
    ],
    description: "More than an accessory—it's a statement. The Crossroad Cap represents a life led by faith, even in the smallest details.",
    features: [
      "Premium Cotton Twill",
      "Embroidered Crossroad Design",
      "Adjustable Strap",
      "Pre-curved Visor",
      "Made with Purpose in Ghana"
    ],
    careInstructions: [
      "Spot clean only",
      "Do not machine wash",
      "Air dry"
    ],
    badge: "PRE-ORDER",
    rating: 5.0,
    reviewCount: 0,
    inStock: true,
    isPreOrder: true,
    expectedDeliveryDate: "2026-05-15",
    stockQuantity: 100,
    tags: ["preorder", "cap", "signature", "crossroads"]
  },
  {
    id: 4,
    name: "Crossroad Carry Tote",
    price: 100,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Natural"],
    image: "assets/images/IMG_1809.JPG.jpeg",
    hoverImage: "assets/images/IMG_1810.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1809.JPG.jpeg",
      "assets/images/IMG_1810.JPG.jpeg",
      "assets/images/IMG_1811.JPG.jpeg",
      "assets/images/IMG_1812.JPG.jpeg"
    ],
    description: "Wherever life takes you, carry the message. The Crossroad Tote is built for movement, purpose, and representing Christ without compromise.",
    features: [
      "100% Heavy Cotton Canvas",
      "Spacious Interior",
      "Reinforced Handles",
      "Internal Pocket",
      "Made with Purpose in Ghana"
    ],
    careInstructions: [
      "Spot clean",
      "Do not machine wash",
      "Line dry"
    ],
    badge: "PRE-ORDER",
    rating: 5.0,
    reviewCount: 0,
    inStock: true,
    isPreOrder: true,
    expectedDeliveryDate: "2026-05-15",
    stockQuantity: 100,
    tags: ["preorder", "tote", "bag", "carry", "crossroads"]
  }
];

// ========================================
// HELPER FUNCTIONS
// ========================================

function getProductById(id) {
  return products.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}

function getPreOrderProducts() {
  return products.filter(product => product.isPreOrder);
}

function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

function getRelatedProducts(productId, limit = 3) {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter(p => p.id !== parseInt(productId))
    .slice(0, limit);
}

// ========================================
// EXPORT TO WINDOW
// ========================================

if (typeof window !== 'undefined') {
  window.products = products;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
  window.getPreOrderProducts = getPreOrderProducts;
  window.searchProducts = searchProducts;
  window.getRelatedProducts = getRelatedProducts;
  
  console.log('✅ Crossroad Collection loaded:', products.length, 'pre-order items');
}