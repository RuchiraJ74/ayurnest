
import { useState, useEffect } from "react";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
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
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';

// Import Supabase client for auth check
import { supabase } from "@/integrations/supabase/client";

// Auth protection wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Check for auth in localStorage as fallback
    const user = localStorage.getItem('ayurnest_user');
    if (user && isAuthenticated === null) {
      setIsAuthenticated(true);
    }
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname]);
  
  if (isAuthenticated === null) {
    // Still checking authentication
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ayur-primary"></div>
    </div>;
  }
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
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
                    <AppLayout>
                      <Outlet />
                    </AppLayout>
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
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/about" element={<AboutPage />} />
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
