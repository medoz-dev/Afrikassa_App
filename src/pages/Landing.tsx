
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Wallet, 
  FileText, 
  Settings,
  Star,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Gestion de Stock",
      description: "Suivez en temps réel vos inventaires de boissons avec précision"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      title: "Suivi des Ventes",
      description: "Enregistrez et analysez toutes vos transactions de vente"
    },
    {
      icon: <Wallet className="h-8 w-8 text-primary" />,
      title: "Gestion de Caisse",
      description: "Contrôlez vos flux financiers et votre trésorerie"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Rapports Détaillés",
      description: "Générez des rapports complets pour analyser vos performances"
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Administration",
      description: "Configurez et personnalisez votre système selon vos besoins"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Analyse IA",
      description: "Utilisez l'intelligence artificielle pour optimiser votre gestion"
    }
  ];

  const stats = [
    { number: "100%", label: "Fiabilité" },
    { number: "24/7", label: "Disponibilité" },
    { number: "∞", label: "Évolutivité" },
    { number: "1", label: "Solution Complète" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">AfriKassa</span>
          </div>
          <Link to="/dashboard">
            <Button>Accéder à l'Application</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Révolutionnez la Gestion de Votre
              <span className="text-primary block">Bar Restaurant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AfriKassa est la solution complète de gestion d'inventaire spécialement conçue 
              pour les bars et restaurants africains. Gérez votre stock, vos ventes, votre caisse 
              et générez des rapports détaillés en toute simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Commencer Maintenant
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Voir la Démonstration
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Complètes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement votre établissement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Creator Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Créé par un Expert
            </h2>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Melchior GANGLO
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Développeur passionné et expert en solutions de gestion pour l'industrie 
                      de la restauration africaine. Melchior a conçu AfriKassa pour répondre 
                      aux besoins spécifiques des entrepreneurs locaux, combinant innovation 
                      technologique et compréhension approfondie du marché.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </div>
                      <span className="text-gray-600">Expert reconnu</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Pourquoi Choisir AfriKassa ?
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sécurité Garantie</h3>
                    <p className="text-gray-600">
                      Vos données sont protégées avec les plus hauts standards de sécurité
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Croissance Assurée</h3>
                    <p className="text-gray-600">
                      Optimisez vos opérations et augmentez votre rentabilité
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Support Dédié</h3>
                    <p className="text-gray-600">
                      Une équipe d'experts à votre disposition pour vous accompagner
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Package className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Solution Complète</h3>
                    <p className="text-gray-600">
                      Tous les outils nécessaires réunis en une seule plateforme
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à Transformer Votre Business ?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines d'entrepreneurs qui font déjà confiance à AfriKassa 
            pour gérer leur établissement avec succès.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Commencer Gratuitement
            </Button>
          </Link>
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

export default Landing;
