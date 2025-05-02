
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Key } from 'lucide-react';

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const correctPassword = "Add me";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      toast({
        title: "Authentification réussie",
        description: "Bienvenue dans le panneau d'administration",
      });
      onAuthenticated();
    } else {
      toast({
        title: "Échec de l'authentification",
        description: "Mot de passe incorrect",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={20} />
          Authentification Admin
        </CardTitle>
        <CardDescription>
          Veuillez entrer le mot de passe administrateur pour accéder au panneau de configuration
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Se connecter</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminAuth;
