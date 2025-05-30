
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Package, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isCreator } = useAuth();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (user) {
      if (isCreator) {
        navigate('/dashboard');
      } else {
        navigate('/caisse');
      }
    }
  }, [user, isCreator, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérification pour le créateur
      if (password === 'meki') {
        toast({
          title: "Connexion créateur réussie",
          description: "Bienvenue dans le panneau créateur !",
        });
        navigate('/dashboard');
        return;
      }

      const success = await signIn(username, password);
      
      if (success) {
        // Redirection vers la page caisse pour les utilisateurs normaux
        navigate('/caisse');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/22961170017', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">AfriKassa</span>
          </Link>
          <Link to="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Connexion à AfriKassa
            </CardTitle>
            <CardDescription className="text-white/90">
              Accédez à votre système de gestion
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas encore d'accès ?
                </p>
                <div className="space-y-3">
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full">
                      Acheter l'application
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleWhatsAppContact}
                  >
                    Contacter le support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Pour obtenir vos identifiants, contactez-nous via WhatsApp
          </p>
          <p className="text-xs text-gray-500 mt-2">
            +229 61 17 00 17
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
