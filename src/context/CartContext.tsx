
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define product type
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

// Define cart item type
export type CartItem = {
  product: Product;
  quantity: number;
};

// Define context type
type CartContextType = {
  items: CartItem[];
  favorites: string[]; // Array of product IDs
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  toggleFavorite: (productId: string) => Promise<void>; // Add this method
  isFavorite: (productId: string) => boolean; // Add this method
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('ayurnest_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    
    // Load favorites from localStorage first
    const savedFavorites = localStorage.getItem('ayurnest_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Then fetch favorites from database if user is logged in
    fetchFavoritesFromDatabase();
  }, []);
  
  // Fetch favorites from database if user is logged in
  const fetchFavoritesFromDatabase = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user?.id) {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', session.session.user.id);
      
      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }
      
      if (data) {
        const favoriteIds = data.map(fav => fav.product_id);
        setFavorites(favoriteIds);
        // Also update local storage
        localStorage.setItem('ayurnest_favorites', JSON.stringify(favoriteIds));
      }
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ayurnest_cart', JSON.stringify(items));
  }, [items]);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ayurnest_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Toggle product as favorite
  const toggleFavorite = async (productId: string) => {
    const isFav = favorites.includes(productId);
    
    // Check if user is logged in
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (isFav) {
      // Remove from favorites
      setFavorites(prevFavorites => prevFavorites.filter(id => id !== productId));
      
      // Remove from database if logged in
      if (userId) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
          
        if (error) {
          console.error('Error removing favorite:', error);
          // Revert the UI change if there's an error
          setFavorites(prevFavorites => [...prevFavorites, productId]);
          toast({
            title: "Error",
            description: "Couldn't remove from favorites. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites list",
      });
    } else {
      // Add to favorites
      setFavorites(prevFavorites => [...prevFavorites, productId]);
      
      // Add to database if logged in
      if (userId) {
        const { error } = await supabase
          .from('favorites')
          .insert({ 
            user_id: userId,
            product_id: productId
          });
          
        if (error) {
          console.error('Error adding favorite:', error);
          // Revert the UI change if there's an error
          setFavorites(prevFavorites => prevFavorites.filter(id => id !== productId));
          toast({
            title: "Error",
            description: "Couldn't add to favorites. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }
      
      toast({
        title: "Added to favorites",
        description: "Item added to your favorites list",
      });
    }
  };
  
  // Check if a product is in favorites
  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );

  return (
    <CartContext.Provider value={{
      items,
      favorites,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
