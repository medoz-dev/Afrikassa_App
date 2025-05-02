
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} BAR RESTAURANT CHEZ MAMAN-DIDI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
