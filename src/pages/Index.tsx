
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the welcome page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ayur-light">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-ayur-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Loading AyurNest...</h1>
        <p className="text-gray-600">Your journey to Ayurvedic wellness begins now</p>
      </div>
    </div>
  );
};

export default Index;
