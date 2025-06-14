
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clipboard, ShoppingCart, Wallet, BarChart3, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  const isInApp = location.pathname !== '/' && location.pathname !== '/pricing';

  const { user, signOut } = useAuth();

  return (
    <header className="bg-primary text-white p-5 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-center md:text-left mb-4 md:mb-0 hover:opacity-80 transition-opacity">
            <h1 className="text-2xl md:text-3xl font-bold">Afri-kassa </h1>
            <p className="text-sm md:text-base opacity-80">Système de gestion d'inventaire</p>
          </Link>
          
          {isInApp && (
            <nav className="flex flex-1 items-center justify-between">
              {/* Liens de navigation */}
              <div className="flex items-center space-x-1 md:space-x-4">
                <NavLink to="/dashboard" icon={<Home size={20} />} label="Accueil" />
                <NavLink to="/stock" icon={<Clipboard size={20} />} label="Stock" />
                <NavLink to="/ventes" icon={<ShoppingCart size={20} />} label="Ventes" />
                <NavLink to="/caisse" icon={<Wallet size={20} />} label="Caisse" />
                <NavLink to="/rapports" icon={<BarChart3 size={20} />} label="Rapports" />
                <NavLink to="/admin" icon={<Settings size={20} />} label="Admin" />
              </div>
              {/* Affichage du profil connecté */}
              <div className="flex items-center gap-2 ml-4">
                {user ? (
                  <>
                    <span className="flex items-center gap-1 px-3 py-1 rounded bg-primary-foreground/10 text-white/90 text-sm">
                      <UserIcon size={16} className="text-white/80" />
                      <span>
                        {user.nom || user.username || user.email}
                      </span>
                    </span>
                    <Button 
                      variant="ghost"
                      className="border border-white/20 hover:bg-white hover:text-primary text-white px-2 py-1"
                      onClick={signOut}
                      title="Se déconnecter"
                    >
                      <LogOut size={18} className="mr-1" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-primary">
                      Se connecter
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          )}
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
