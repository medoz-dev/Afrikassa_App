import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Check, MessageCircle, Phone } from 'lucide-react';

const Pricing: React.FC = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/22961170017', '_blank');
  };

  const handleFacebookContact = () => {
    window.open('https://web.facebook.com/melchior.melchior.2025', '_blank');
  };

  const handlePurchase = () => {
    alert('Après votre paiement, vous recevrez vos identifiants de connexion par WhatsApp. Vous pourrez ensuite accéder à l\'application via la page de connexion.');
  };

  const features = [
    "Gestion complète du stock de boissons",
    "Suivi des ventes en temps réel",
    "Gestion de caisse intégrée",
    "Rapports détaillés et analyses",
    "Interface intuitive et moderne",
    "Support technique inclus",
    "Mises à jour gratuites à vie",
    "Formation à l'utilisation",
    "Sauvegarde automatique des données",
    "Accès multi-utilisateurs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
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
      </header>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Plan Tarifaire AfriKassa
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Investissez dans l'avenir de votre business avec une solution complète 
              de gestion pour votre bar ou restaurant.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="flex justify-center mb-16">
            <Card className="w-full max-w-lg border-0 shadow-2xl">
              <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold mb-2">
                  Solution Complète
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Licence unique, fonctionnalités illimitées
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">200 000</span>
                  <span className="text-2xl ml-2">FCFA</span>
                  <div className="text-white/90 mt-2">Paiement unique</div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6"
                    onClick={handlePurchase}
                  >
                    Procéder au Paiement
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={handleWhatsAppContact}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={handleFacebookContact}
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Installation Rapide</h3>
                <p className="text-gray-600">
                  Configuration en moins de 30 minutes avec notre équipe
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Support Dédié</h3>
                <p className="text-gray-600">
                  Assistance technique disponible 7j/7 via WhatsApp
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Garantie Satisfait</h3>
                <p className="text-gray-600">
                  30 jours de garantie ou remboursement intégral
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="text-center bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Des Questions ? Contactez-nous !
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous accompagner dans votre projet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <MessageCircle className="h-5 w-5" />
                <span>+229 61 17 00 17</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <Phone className="h-5 w-5" />
                <span>Melchior GANGLO</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
