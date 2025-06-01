
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Check, MessageCircle, Phone, Crown, Calendar, AlertTriangle } from 'lucide-react';

const Pricing: React.FC = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/22961170017', '_blank');
  };

  const handleFacebookContact = () => {
    window.open('https://web.facebook.com/melchior.melchior.2025', '_blank');
  };

  const handlePurchase = (planType: string) => {
    alert(`Après votre paiement ${planType}, vous recevrez vos identifiants de connexion par WhatsApp. Vous pourrez ensuite accéder à l'application via la page de connexion.`);
  };

  const lifetimeFeatures = [
    "Gestion complète du stock de boissons",
    "Suivi des ventes en temps réel",
    "Gestion de caisse intégrée",
    "Rapports détaillés et analyses",
    "Interface intuitive et moderne",
    "Support technique inclus",
    "Mises à jour gratuites à vie",
    "Formation à l'utilisation",
    "Sauvegarde automatique des données",
    "Accès multi-utilisateurs",
    "Aucun frais récurrent"
  ];

  const subscriptionFeatures = [
    "Gestion complète du stock de boissons",
    "Suivi des ventes en temps réel",
    "Gestion de caisse intégrée",
    "Rapports détaillés et analyses",
    "Interface intuitive et moderne",
    "Support technique inclus",
    "Sauvegarde automatique des données",
    "7 jours d'essai gratuit inclus"
  ];

  const subscriptionPlans = [
    { duration: "1 mois", price: 10000, popular: false },
    { duration: "3 mois", price: 25000, popular: false },
    { duration: "5 mois", price: 45000, popular: true },
    { duration: "7 mois", price: 65000, popular: false },
    { duration: "1 an", price: 100000, popular: false },
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Plans Tarifaires AfriKassa
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Choisissez la formule qui convient le mieux à votre business
            </p>
            
            {/* Warning Notice */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">
                  Important : Aucun abonnement n'est remboursé
                </p>
              </div>
            </div>
          </div>

          {/* Lifetime Purchase Card */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Achat Complet - Abonnement à Vie
            </h2>
            <div className="flex justify-center mb-8">
              <Card className="w-full max-w-lg border-0 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-sm font-bold">
                  RECOMMANDÉ
                </div>
                <CardHeader className="text-center pb-8 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-t-lg">
                  <CardTitle className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Crown className="h-8 w-8" />
                    Solution Complète à Vie
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    Paiement unique, accès illimité
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">250 000</span>
                    <span className="text-2xl ml-2">FCFA</span>
                    <div className="text-white/90 mt-2">Paiement unique</div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4 mb-8">
                    {lifetimeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-6 bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => handlePurchase("de l'abonnement à vie")}
                  >
                    Acheter l'Abonnement à Vie
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Abonnements Mensuels
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-blue-700 font-medium">
                  Votre premier abonnement inclut 7 jours d'essai gratuit
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <Card key={index} className={`border-0 shadow-lg relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 text-xs font-bold rounded-full">
                      POPULAIRE
                    </div>
                  )}
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-xl font-bold mb-2">
                      {plan.duration}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                      <span className="text-lg ml-1">FCFA</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-3 mb-6">
                      {subscriptionFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handlePurchase(`de l'abonnement ${plan.duration}`)}
                    >
                      Choisir {plan.duration}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Moyens de Paiement et Contact
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Button 
                size="lg" 
                className="w-full h-16 text-lg"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                Contacter via WhatsApp
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="w-full h-16 text-lg"
                onClick={handleFacebookContact}
              >
                <Phone className="h-6 w-6 mr-3" />
                Contacter via Facebook
              </Button>
            </div>
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
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Essai Gratuit</h3>
                <p className="text-gray-600">
                  7 jours d'essai gratuit inclus avec votre premier abonnement
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
              Notre équipe est là pour vous accompagner dans votre choix
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
            
            <div className="mt-6 p-4 bg-red-100 rounded-lg">
              <p className="text-red-800 font-semibold text-sm">
                ⚠️ IMPORTANT : Tous les paiements sont définitifs. Aucun remboursement ne sera effectué.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
