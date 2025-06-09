
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket, Plus, Copy, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActivationCode {
  id: string;
  code: string;
  plan_type: string;
  duration_days: number;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
  expires_at: string | null;
  max_uses: number;
  current_uses: number;
}

const ActivationCodesManager: React.FC = () => {
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [newCode, setNewCode] = useState({
    plan_type: 'basic',
    duration_days: 30,
    expires_at: '',
    max_uses: 1
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Charger les codes d'activation
  const loadCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des codes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes d'activation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  // Générer un nouveau code
  const generateCode = async () => {
    setIsGenerating(true);
    try {
      // Générer le code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_activation_code');

      if (codeError) throw codeError;

      const newCodeValue = codeData;

      // Préparer les données pour l'insertion
      const insertData: any = {
        code: newCodeValue,
        plan_type: newCode.plan_type,
        duration_days: newCode.duration_days,
        created_by: 'creator-local', // ID du créateur
        max_uses: newCode.max_uses,
        current_uses: 0
      };

      // Ajouter la date d'expiration si spécifiée
      if (newCode.expires_at) {
        insertData.expires_at = new Date(newCode.expires_at).toISOString();
      }

      // Insérer le code dans la base de données
      const { error: insertError } = await supabase
        .from('activation_codes')
        .insert(insertData);

      if (insertError) throw insertError;

      toast({
        title: "Code généré !",
        description: `Code d'activation ${newCodeValue} créé avec succès`,
      });

      // Réinitialiser le formulaire et recharger les codes
      setNewCode({
        plan_type: 'basic',
        duration_days: 30,
        expires_at: '',
        max_uses: 1
      });
      await loadCodes();

    } catch (error) {
      console.error('Erreur lors de la génération du code:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copier un code dans le presse-papiers
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié !",
      description: `Le code ${code} a été copié dans le presse-papiers`,
    });
  };

  // Supprimer un code
  const deleteCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activation_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Code supprimé",
        description: "Le code d'activation a été supprimé",
      });

      await loadCodes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du code",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Générateur de codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Générer un nouveau code d'activation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan_type">Type d'abonnement</Label>
              <Select 
                value={newCode.plan_type} 
                onValueChange={(value) => setNewCode({ ...newCode, plan_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (jours)</Label>
              <Select 
                value={newCode.duration_days.toString()} 
                onValueChange={(value) => setNewCode({ ...newCode, duration_days: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours (essai)</SelectItem>
                  <SelectItem value="30">30 jours (1 mois)</SelectItem>
                  <SelectItem value="90">90 jours (3 mois)</SelectItem>
                  <SelectItem value="180">180 jours (6 mois)</SelectItem>
                  <SelectItem value="365">365 jours (1 an)</SelectItem>
                  <SelectItem value="-1">Illimité</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_uses">Nombre d'utilisations max</Label>
              <Input
                id="max_uses"
                type="number"
                min="1"
                value={newCode.max_uses}
                onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Date d'expiration (optionnel)</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={newCode.expires_at}
                onChange={(e) => setNewCode({ ...newCode, expires_at: e.target.value })}
              />
            </div>
          </div>
          
          <Button onClick={generateCode} disabled={isGenerating} className="mt-4">
            <Ticket className="h-4 w-4 mr-2" />
            {isGenerating ? "Génération..." : "Générer le code"}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Codes d'activation ({codes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun code d'activation généré</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code) => {
                    const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                    const isUsedUp = code.current_uses >= code.max_uses;
                    
                    return (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono font-bold text-primary">
                          {code.code}
                        </TableCell>
                        <TableCell className="capitalize">{code.plan_type}</TableCell>
                        <TableCell>
                          {code.duration_days === -1 ? 'Illimité' : `${code.duration_days} jours`}
                        </TableCell>
                        <TableCell>
                          {code.current_uses}/{code.max_uses}
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${
                            isUsedUp ? 'text-red-600' :
                            isExpired ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {isUsedUp ? '✅ Utilisé' :
                             isExpired ? '⏰ Expiré' :
                             '🟢 Disponible'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(code.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(code.code)}
                              disabled={isUsedUp}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCode(code.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivationCodesManager;
