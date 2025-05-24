
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Check, 
  MessageCircle, 
  Facebook,
  CreditCard,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

const Pricing: React.FC = () => {
  const features = [
    "Gestion complète de stock",
    "Suivi des ventes en temps réel",
    "Gestion de caisse intégrée",
    "Rapports détaillés et analytics",
    "Interface intuitive et moderne",
    "Support technique inclus",
    "Mises à jour gratuites",
    "Formation d'utilisation"
  ];

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/22961170017', '_blank');
  };

  const handleFacebookContact = () => {
    window.open('https://web.facebook.com/melchior.melchior.2025', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">AfriKassa</span>
          </Link>
          <Link to="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tarification Simple et Transparente
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accédez à toutes les fonctionnalités d'AfriKassa avec un seul paiement. 
              Aucun abonnement, aucune surprise.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto mb-16">
            <Card className="border-2 border-primary shadow-2xl">
              <CardHeader className="text-center bg-primary text-white rounded-t-lg">
                <div className="flex justify-center mb-4">
                  <Package className="h-16 w-16" />
                </div>
                <CardTitle className="text-3xl mb-2">AfriKassa Complet</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Solution complète pour votre établissement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-primary mb-2">150,000</div>
                  <div className="text-xl text-gray-600">FCFA</div>
                  <div className="text-sm text-gray-500 mt-2">Paiement unique - Licence à vie</div>
                </div>

                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Button */}
                <Button 
                  size="lg" 
                  className="w-full mb-4 text-lg py-6"
                  onClick={() => alert('Fonctionnalité de paiement bientôt disponible')}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Procéder au Paiement
                </Button>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg py-4"
                    onClick={handleWhatsAppContact}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contacter sur WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg py-4"
                    onClick={handleFacebookContact}
                  >
                    <Facebook className="mr-2 h-5 w-5" />
                    Contacter sur Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Sécurisé</h3>
                <p className="text-gray-600">
                  Vos données sont protégées avec les plus hauts standards de sécurité
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Support Dédié</h3>
                <p className="text-gray-600">
                  Assistance technique et formation complète incluses
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Évolutif</h3>
                <p className="text-gray-600">
                  Solution qui grandit avec votre business
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Une Question ? Contactez-nous !
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous accompagner dans votre choix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-700">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span>WhatsApp: +229 61170017</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Facebook className="h-5 w-5 text-blue-600" />
                <span>Facebook: Melchior GANGLO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-6 w-6" />
            <span className="text-lg font-semibold">AfriKassa</span>
          </div>
          <p className="text-gray-400 mb-4">
            Solution de gestion d'inventaire pour bars et restaurants
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Créé par Melchior GANGLO. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
