
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Truck, User, Info } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: ShoppingBag, label: 'Shop', path: '/shop' },
    { icon: Truck, label: 'Track', path: '/track-order' },
    { icon: Info, label: 'About', path: '/about' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    // Use direct navigation instead of react-router's navigate
    // This helps with certain navigation issues
    window.location.href = path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                className="flex flex-col items-center flex-1"
                onClick={() => handleNavigation(item.path)}
              >
                <div className={`p-1 ${isActive ? 'text-ayur-primary' : 'text-gray-500'}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-xs ${isActive ? 'text-ayur-primary font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
