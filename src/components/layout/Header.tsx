
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Clipboard, ShoppingCart, Wallet, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-5 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">BAR RESTAURANT CHEZ MAMAN-DIDI</h1>
            <p className="text-sm md:text-base opacity-80">Système de gestion d'inventaire</p>
          </div>
          
          <nav className="flex items-center space-x-1 md:space-x-4">
            <NavLink to="/" icon={<Home size={20} />} label="Accueil" />
            <NavLink to="/stock" icon={<Clipboard size={20} />} label="Stock" />
            <NavLink to="/ventes" icon={<ShoppingCart size={20} />} label="Ventes" />
            <NavLink to="/caisse" icon={<Wallet size={20} />} label="Caisse" />
            <NavLink to="/rapports" icon={<BarChart3 size={20} />} label="Rapports" />
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center px-2 py-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default Header;
