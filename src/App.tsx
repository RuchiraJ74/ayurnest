import { useState, useEffect } from "react";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

// Pages
import Welcome from "@/components/Welcome";
import { SignupForm, LoginForm } from "@/components/AuthForms";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import DoshaTest from "@/components/DoshaTest";
import DoshaResult from "@/components/DoshaResult";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import DailyRoutinePage from "@/pages/DailyRoutinePage";
import DietPage from "@/pages/DietPage";
import RemediesPage from "@/pages/RemediesPage";
import RemedyDetailPage from "@/pages/RemedyDetailPage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import ResetPasswordForm from "@/components/ResetPasswordForm";

// Auth protection wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('ayurnest_user');
    setIsAuthenticated(!!user);
  }, []);
  
  if (isAuthenticated === null) {
    // Still checking authentication
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ayur-primary"></div>
    </div>;
  }
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <ShadcnToaster />
          <Toaster position="top-right" richColors closeButton />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/dosha-test" element={<DoshaTest />} />
                <Route path="/dosha-result" element={<DoshaResult />} />
                
                {/* Protected Routes with AppLayout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/daily-routine" element={<DailyRoutinePage />} />
                  <Route path="/diet" element={<DietPage />} />
                  <Route path="/remedies" element={<RemediesPage />} />
                  <Route path="/remedies/:id" element={<RemedyDetailPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/shop/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-tracking" element={<OrderTrackingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
