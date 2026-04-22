// ========================================
// AMEN+ CROSSROAD COLLECTION
// PERFECTLY MAPPED PRE-ORDER LAUNCH CATALOG
// ========================================

const products = [
  // ============ STATEMENT SHIRTS (PRE-ORDER) ============
  {
    id: 1,
    name: "Crossroad Statement Polo - Brown",
    price: 200,
    category: "Shirt",
    subCategory: "statement",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1791.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1791.JPG.jpeg",
      "assets/images/IMG_1792.JPG.jpeg",
      "assets/images/IMG_1793.JPG.jpeg"
    ],
    description: "At every crossroad, a choice is made. This premium brown polo with cream accents represents the decision to stand firm in Christ.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 2,
    name: "Crossroad Statement Polo - Off-White",
    price: 200,
    category: "Shirt",
    subCategory: "statement",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1786.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1786.JPG.jpeg",
      "assets/images/IMG_1787.JPG.jpeg",
      "assets/images/IMG_1788.JPG.jpeg"
    ],
    description: "The signature Crossroad Statement Polo in off-white (cream). A bold declaration of faith for those who walk in purpose.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ ESSENTIAL TEES (PRE-ORDER) ============
  {
    id: 3,
    name: "Crossroad Essential Tee - Brown",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1798.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1798.JPG.jpeg",
      "assets/images/IMG_1799.JPG.jpeg"
    ],
    description: "Everyday wear, eternal message. The brown Crossroad Tee is a reminder that no matter the path, God is at the center of it all.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 4,
    name: "Crossroad Essential Tee - Off-White",
    price: 150,
    category: "Shirt",
    subCategory: "tees",
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "assets/images/IMG_1801.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1801.JPG.jpeg"
    ],
    description: "Premium cotton off-white tee with the Crossroad signature design. Comfortable, classic, faith-driven.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ SIGNATURE CAPS (PRE-ORDER) ============
  {
    id: 5,
    name: "Crossroad Signature Cap - Cream/Brown",
    price: 100,
    category: "Accessory",
    subCategory: "caps",
    sizes: ["One Size"],
    image: "assets/images/IMG_1811.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1811.JPG.jpeg"
    ],
    description: "More than an accessory—it's a statement. Premium cream crown with brown brim and mesh details.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 6,
    name: "Crossroad Signature Cap - Black",
    price: 100,
    category: "Accessory",
    subCategory: "caps",
    sizes: ["One Size"],
    image: "assets/images/IMG_1812.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1812.JPG.jpeg"
    ],
    description: "Top off your faith. Premium black cap with bold white embroidered Crossroad design.",
    preorder: true,
    badge: "Pre-order"
  },

  // ============ CARRY TOTES (PRE-ORDER) ============
  {
    id: 7,
    name: "Crossroad Carry Tote - Brown",
    price: 100,
    category: "Accessory",
    subCategory: "totes",
    sizes: ["One Size"],
    image: "assets/images/IMG_1809.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1809.JPG.jpeg",
      "assets/images/IMG_1810.JPG.jpeg"
    ],
    description: "Wherever life takes you, carry the message. The Brown Crossroad Tote features the 'LIVING EPISTLE' design.",
    preorder: true,
    badge: "Pre-order"
  },
  {
    id: 8,
    name: "Crossroad Carry Tote - Off-White",
    price: 100,
    category: "Accessory",
    subCategory: "totes",
    sizes: ["One Size"],
    image: "assets/images/IMG_1807.JPG.jpeg",
    gallery: [
      "assets/images/IMG_1807.JPG.jpeg"
    ],
    description: "Built for movement and purpose. The Off-White Crossroad Tote perfectly complements the off-white apparel.",
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
  console.log('✅ Perfectly Mapped Crossroad Collection loaded:', products.length, 'products');
}