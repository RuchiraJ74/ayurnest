
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppLayout from '@/components/AppLayout';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import RemediesPage from '@/pages/RemediesPage';
import RemedyDetailPage from '@/pages/RemedyDetailPage';
import DailyRoutinePage from '@/pages/DailyRoutinePage';
import DietPage from '@/pages/DietPage';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import FeedbackPage from '@/pages/FeedbackPage';
import DoshaTest from '@/components/DoshaTest';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/remedies" element={<RemediesPage />} />
                <Route path="/remedies/:id" element={<RemedyDetailPage />} />
                <Route path="/daily-routine" element={<DailyRoutinePage />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/dosha-test" element={<DoshaTest />} />
                <Route path="/login" element={<Index initialTab="login" />} />
                <Route path="/auth" element={<Index initialTab="login" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
