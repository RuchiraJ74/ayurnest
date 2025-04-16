
import { Product } from "../context/CartContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Ayurvedic Hair Oil",
    description: "Nourishing blend of herbs and oils for healthy hair growth and scalp care.",
    price: 24.99,
    category: "Oils & Soaps",
    image: "https://elephantrunk.in/cdn/shop/products/neelibhringadioil.jpg?v=1634629682"
  },
  {
    id: "2",
    name: "Ashwagandha Capsules",
    description: "Organic Ashwagandha root extract for stress relief and immunity support.",
    price: 19.99,
    category: "Supplements",
    image: "https://m.media-amazon.com/images/I/71wHFO9yJgL._AC_UF1000,1000_QL80_.jpg"
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
    image: "https://smytten-image.gumlet.io/discover_product/1617178472_DRIV0060AB1.jpg"
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
    image: "https://m.media-amazon.com/images/I/61jQ19mUDhL.jpg"
  },
  {
    id: "8",
    name: "Neem & Tulsi Soap",
    description: "Natural antibacterial soap for clear skin and infection prevention.",
    price: 8.99,
    category: "Oils & Soaps",
    image: "https://m.media-amazon.com/images/I/71aKkz0nskL._AC_UF1000,1000_QL80_.jpg"
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
    image: "https://ptal.in/cdn/shop/files/DSCF0183.jpg?v=1743599168&width=1080"
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
    image: "https://m.media-amazon.com/images/I/71k-CMfTa+L._AC_UF1000,1000_QL80_.jpg"
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
