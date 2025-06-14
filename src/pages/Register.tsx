
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Package, Eye, EyeOff, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nom, setNom] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await signUp(email, password, { nom, username });
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Erreur d\'inscription Google:', error);
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
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Se connecter</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              Inscription AfriKassa
            </CardTitle>
            <CardDescription className="text-white/90">
              Créez votre compte gratuit
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {/* Inscription Google */}
            <div className="space-y-4 mb-6">
              <Button 
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
              >
                <Mail className="mr-2 h-5 w-5" />
                S'inscrire avec Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            {/* Inscription Email */}
            <form onSubmit={handleEmailSignUp} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label htmlFor="nom" className="text-sm font-medium text-gray-700">
                  Nom complet *
                </label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nom d'utilisateur (optionnel)
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nom d'utilisateur unique"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe (min. 6 caractères)"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer mon compte gratuit"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?
                </p>
                <div className="space-y-3">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full">
                      Voir les tarifs
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
            🎉 Inscription 100% gratuite - Choisissez ensuite votre abonnement
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Support: +229 61 17 00 17
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
