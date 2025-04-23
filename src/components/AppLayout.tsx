import React from 'react';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
};

export default AppLayout;
