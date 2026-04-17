// ========================================
// AMEN+ CROSSROAD COLLECTION
// COMPLETE PRE-ORDER LAUNCH CATALOG
// ========================================

const products = [
  // ============ STATEMENT SHIRTS (PRE-ORDER) ============
  {
    id: 1,
    name: "Crossroad Statement Shirt - Brown",
    price: 200,
    category: "Shirt",
    subCategory: "statement",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1786.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1786.JPG.jpeg",
      "assets/images/IMG_1787.JPG.jpeg",
      "assets/images/IMG_1788.JPG.jpeg",
      "assets/images/IMG_1789.JPG.jpeg"
    ],
    description: "At every crossroad, a choice is made. This piece represents the decision to stand firm in Christ—bold in faith, clear in purpose, and unapologetic in identity.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 2,
    name: "Crossroad Statement Shirt - Off-White",
    price: 200,
    category: "Shirt",
    subCategory: "statement",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1810.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1810.JPG.jpeg",
      "assets/images/IMG_1811.JPG.jpeg",
      "assets/images/IMG_1812.JPG.jpeg"
    ],
    description: "The signature Crossroad Statement Shirt in off-white. A bold declaration of faith for those who walk in purpose.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ ESSENTIAL TEES (PRE-ORDER) ============
  {
    id: 3,
    name: "Crossroad Essential Tee - Style 1",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1790.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1790.JPG.jpeg",
      "assets/images/IMG_1791.JPG.jpeg"
    ],
    description: "Everyday wear, eternal message. The Crossroad Tee is a reminder that no matter the path, God is at the center of it all.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 4,
    name: "Crossroad Essential Tee - Style 2",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1792.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1792.JPG.jpeg",
      "assets/images/IMG_1793.JPG.jpeg"
    ],
    description: "Premium cotton tee with the Crossroad signature design. Comfortable, classic, faith-driven.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 5,
    name: "Crossroad Essential Tee - Style 3",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1794.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1794.JPG.jpeg",
      "assets/images/IMG_1795.JPG.jpeg"
    ],
    description: "Bold and faith-forward. This tee makes a statement wherever you go.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 6,
    name: "Crossroad Essential Tee - Style 4",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1796.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1796.JPG.jpeg",
      "assets/images/IMG_1797.JPG.jpeg"
    ],
    description: "Premium quality, comfortable fit. Wear your faith with confidence.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 7,
    name: "Crossroad Essential Tee - Style 5",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1798.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1798.JPG.jpeg",
      "assets/images/IMG_1799.JPG.jpeg"
    ],
    description: "The Crossroad Essential Tee — your everyday declaration of faith.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ SIGNATURE CAPS (PRE-ORDER) ============
  {
    id: 8,
    name: "Crossroad Signature Cap - Style 1",
    price: 100,
    category: "Accessory",
    subCategory: "caps",
    sizes: ["One Size"],
    image: "assets/images/IMG_1800.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1800.JPG.jpeg",
      "assets/images/IMG_1801.JPG.jpeg"
    ],
    description: "More than an accessory—it's a statement. The Crossroad Cap represents a life led by faith, even in the smallest details.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 9,
    name: "Crossroad Signature Cap - Style 2",
    price: 100,
    category: "Accessory",
    subCategory: "caps",
    sizes: ["One Size"],
    image: "assets/images/IMG_1802.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1802.JPG.jpeg",
      "assets/images/IMG_1803.JPG.jpeg"
    ],
    description: "Premium embroidered cap with the Crossroad signature. Adjustable fit for everyday wear.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 10,
    name: "Crossroad Signature Cap - Style 3",
    price: 100,
    category: "Accessory",
    subCategory: "caps",
    sizes: ["One Size"],
    image: "assets/images/IMG_1804.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1804.JPG.jpeg",
      "assets/images/IMG_1805.JPG.jpeg"
    ],
    description: "Top off your faith. Premium cotton cap with embroidered Crossroad design.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ CARRY TOTES (PRE-ORDER) ============
  {
    id: 11,
    name: "Crossroad Carry Tote - Style 1",
    price: 100,
    category: "Accessory",
    subCategory: "totes",
    sizes: ["One Size"],
    image: "assets/images/IMG_1809.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1809.JPG.jpeg",
      "assets/images/IMG_1807.JPG.jpeg"
    ],
    description: "Wherever life takes you, carry the message. The Crossroad Tote is built for movement, purpose, and representing Christ without compromise.",
    preorder: true,
    badge: "Pre-order"
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

function getProductsBySubCategory(subCategory) {
  return products.filter(product => product.subCategory === subCategory);
}

// Export for browser
if (typeof window !== 'undefined') {
  window.products = products;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
  window.getProductsBySubCategory = getProductsBySubCategory;
  console.log('✅ Crossroad Collection loaded:', products.length, 'products ready for pre-order');
}