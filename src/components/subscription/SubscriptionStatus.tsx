
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const SubscriptionStatus: React.FC = () => {
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [status, setStatus] = useState<'active' | 'expiring' | 'expired'>('active');

  useEffect(() => {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setSubscriptionInfo(user);

      if (user.dateExpiration) {
        const expirationDate = new Date(user.dateExpiration);
        const today = new Date();
        const diffTime = expirationDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setDaysRemaining(diffDays);

        if (diffDays <= 0) {
          setStatus('expired');
        } else if (diffDays <= 7) {
          setStatus('expiring');
        } else {
          setStatus('active');
        }
      }
    }
  }, []);

  if (!subscriptionInfo || !subscriptionInfo.dateExpiration) {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expiring': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expiring': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'expired': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'active': 
        return `Votre abonnement est actif. Il vous reste ${daysRemaining} jour(s).`;
      case 'expiring': 
        return `Attention ! Votre abonnement expire dans ${daysRemaining} jour(s). Contactez l'administrateur pour le renouveler.`;
      case 'expired': 
        return 'Votre abonnement a expiré. Contactez l\'administrateur pour le renouveler.';
      default: 
        return 'Statut d\'abonnement inconnu.';
    }
  };

  return (
    <Card className={`border-l-4 ${status === 'expired' ? 'border-l-red-500' : status === 'expiring' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          État de l'abonnement
          <Badge className={getStatusColor()}>
            {status === 'active' ? 'Actif' : status === 'expiring' ? 'Expire bientôt' : 'Expiré'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {getStatusMessage()}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Date d'expiration : {new Date(subscriptionInfo.dateExpiration).toLocaleDateString('fr-FR')}</span>
          </div>
          {(status === 'expiring' || status === 'expired') && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                💡 Pour renouveler votre abonnement, contactez-nous via WhatsApp : +229 61 17 00 17
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
