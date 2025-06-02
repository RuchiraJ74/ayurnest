
import React from 'react';

interface PaymentIconProps {
  type: 'googlepay' | 'phonepe';
  className?: string;
}

export const PaymentIcon: React.FC<PaymentIconProps> = ({ type, className = "w-8 h-8" }) => {
  if (type === 'googlepay') {
    return (
      <div className={`${className} flex items-center justify-center bg-white rounded-lg border p-1`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
      </div>
    );
  }

  if (type === 'phonepe') {
    return (
      <div className={`${className} flex items-center justify-center bg-purple-600 rounded-lg p-1`}>
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 6h5c1.38 0 2.5 1.12 2.5 2.5S15.88 11 14.5 11H12v2h2.5c.28 0 .5.22.5.5s-.22.5-.5.5H12v2c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2H9.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H11V11H9.5c-1.38 0-2.5-1.12-2.5-2.5S8.12 6 9.5 6z"/>
        </svg>
      </div>
    );
  }

  return null;
};

export default PaymentIcon;
