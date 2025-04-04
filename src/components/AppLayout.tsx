
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const tabItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Routine', icon: Calendar, path: '/daily-routine' },
    { label: 'Remedies', icon: BookOpen, path: '/remedies' },
    { label: 'Shop', icon: ShoppingBag, path: '/shop' },
    { label: 'Profile', icon: User, path: '/profile' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-ayur-light">
      <main className="flex-1 pb-20 overflow-x-hidden">
        <Outlet />
      </main>
      
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-top flex items-center justify-around px-2 z-10"
      >
        {tabItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bottom-tab ${
                isActive ? 'bottom-tab-active' : 'bottom-tab-inactive'
              }`}
            >
              <item.icon size={isMobile ? 18 : 20} />
              <span className="mt-1 text-xs">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 h-1 w-10 bg-ayur-primary rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default AppLayout;
