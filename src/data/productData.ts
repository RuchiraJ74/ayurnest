
import { Product } from "../context/CartContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Ayurvedic Hair Oil",
    description: "Nourishing blend of herbs and oils for healthy hair growth and scalp care.",
    price: 24.99,
    category: "Oils & Soaps",
    image: "https://images.unsplash.com/photo-1598532213005-004c5491e929?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "2",
    name: "Ashwagandha Capsules",
    description: "Organic Ashwagandha root extract for stress relief and immunity support.",
    price: 19.99,
    category: "Supplements",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "3",
    name: "Turmeric & Neem Face Pack",
    description: "Natural blend of turmeric and neem for clear, radiant skin.",
    price: 16.50,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "4",
    name: "Triphala Powder",
    description: "Traditional Ayurvedic blend for digestive health and detoxification.",
    price: 14.99,
    category: "Supplements",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "5",
    name: "Aloe Vera Gel",
    description: "Pure aloe vera gel for skin care, burns, and hydration.",
    price: 12.99,
    category: "Skin Care",
    image: "https://images.unsplash.com/photo-1596467746588-53300e703a24?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "6",
    name: "Herbal Digestive Tea",
    description: "Blend of digestive herbs to aid digestion and reduce bloating.",
    price: 15.99,
    category: "Teas",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "7",
    name: "Brahmi Brain Tonic",
    description: "Traditional herb for mental clarity, focus and cognitive function.",
    price: 22.99,
    category: "Supplements",
    image: "https://images.unsplash.com/photo-1611930022073-44532eebe363?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "8",
    name: "Neem & Tulsi Soap",
    description: "Natural antibacterial soap for clear skin and infection prevention.",
    price: 8.99,
    category: "Oils & Soaps",
    image: "https://images.unsplash.com/photo-1607006430242-da4d66358b05?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "9",
    name: "Meditation Cushion Set",
    description: "Comfortable cushion set for daily meditation practice.",
    price: 39.99,
    category: "Wellness Kits",
    image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "10",
    name: "Copper Water Bottle",
    description: "Traditional copper vessel for storing water with health benefits.",
    price: 29.99,
    category: "Wellness Kits",
    image: "https://images.unsplash.com/photo-1587582616563-d49a76c591c0?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "11",
    name: "Immunity Booster Kit",
    description: "Complete kit with herbs and supplements for immune support.",
    price: 49.99,
    category: "Wellness Kits",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: "12",
    name: "Sleep Well Herbal Blend",
    description: "Calming herbs to promote deep, restful sleep naturally.",
    price: 18.99,
    category: "Teas",
    image: "https://images.unsplash.com/photo-1576092762791-dd9e2220b1c0?auto=format&fit=crop&q=80&w=400&h=400"
  }
];

export const categories = [
  "All Products",
  "Oils & Soaps",
  "Supplements",
  "Skin Care",
  "Teas",
  "Wellness Kits"
];

export const getProductsByCategory = (categoryName: string) => {
  if (categoryName === "All Products") {
    return products;
  }
  return products.filter(product => product.category === categoryName);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (product: Product, limit = 4) => {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
};
