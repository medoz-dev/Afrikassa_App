
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Package, Eye, EyeOff, UserPlus, Ticket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    activationCode: '',
    username: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifications de base
      if (!formData.activationCode || !formData.username || !formData.nom || !formData.email || !formData.password) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
          variant: "destructive"
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive"
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Erreur",
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive"
        });
        return;
      }

      console.log('Tentative d\'activation avec le code:', formData.activationCode);

      // Utiliser directement la fonction RPC qui gère toutes les validations
      const { data, error } = await supabase
        .rpc('use_activation_code', {
          p_code: formData.activationCode.toUpperCase(),
          p_username: formData.username,
          p_nom: formData.nom,
          p_email: formData.email,
          p_password: formData.password
        });

      if (error) {
        console.error('Erreur lors de l\'activation:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'activation du compte: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Résultat de l\'activation:', data);

      if (!data || data.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune réponse reçue du serveur",
          variant: "destructive"
        });
        return;
      }

      const result = data[0];
      if (!result.success) {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de l'activation",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Compte créé avec succès !",
        description: "Vous pouvez maintenant vous connecter avec vos identifiants",
      });

      // Rediriger vers la page de connexion
      navigate('/login');

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de l'inscription",
        variant: "destructive"
      });
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

      {/* Registration Form */}
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              Créer votre compte
            </CardTitle>
            <CardDescription className="text-white/90">
              Utilisez votre code d'activation pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="activationCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Code d'activation
                </label>
                <Input
                  id="activationCode"
                  type="text"
                  placeholder="Entrez votre code d'activation"
                  value={formData.activationCode}
                  onChange={(e) => setFormData({ ...formData, activationCode: e.target.value.toUpperCase() })}
                  required
                  className="h-12 uppercase"
                  maxLength={8}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nom" className="text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nom d'utilisateur unique"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    placeholder="Créez un mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas de code d'activation ?
                </p>
                <div className="space-y-3">
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full">
                      Acheter un code d'activation
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
            Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Support : +229 61 17 00 17
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
