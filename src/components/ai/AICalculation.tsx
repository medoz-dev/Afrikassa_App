import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Image, FileText, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const AICalculation: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [results, setResults] = useState<{name: string, quantity: number}[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { boissons, updateBoissons, updateStockItem } = useAppContext();

  // Reset error when file changes
  useEffect(() => {
    if (file) {
      setErrorMessage(null);
    }
  }, [file]);

  // Simulate processing progress
  const simulateProgress = () => {
    setProgressValue(0);
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      handleFile(selectedFile);
    }
  };
  
  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage(null);
    setResults([]);
    
    // Create a preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result as string);
      };
      fileReader.onerror = () => {
        setErrorMessage("Erreur lors de la lecture du fichier");
        setPreview(null);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
    
    toast({
      title: "Fichier sélectionné",
      description: `${selectedFile.name} est prêt à être analysé.`,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const processWithGemini = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sélectionner un fichier.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setResults([]);
    setErrorMessage(null);
    const cleanupProgress = simulateProgress();

    try {
      console.log("Début du traitement avec Gemini...");
      
      const base64 = await fileToBase64(file);

      let content: any = [];
      
      if (file.type.startsWith('image/')) {
        content = [
          {
            parts: [
              {
                text: `Analysez cette image qui contient une liste de boissons avec des calculs mathématiques. 
                
                Le format est généralement : NOM_BOISSON(nombre1+nombre2+nombre3+...)
                
                Par exemple :
                - Flag(2+5+3+9) = Flag avec un total de 19
                - Castel(5+8+9+7) = Castel avec un total de 29
                
                Votre tâche :
                1. Identifiez chaque nom de boisson
                2. Calculez la somme des nombres entre parenthèses pour chaque boisson
                3. Retournez le résultat UNIQUEMENT sous ce format JSON exact :
                [{"name": "Flag", "quantity": 19}, {"name": "Castel", "quantity": 29}]
                
                Ne retournez rien d'autre que le JSON, pas d'explication, pas de texte supplémentaire.`
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64.split(',')[1]
                }
              }
            ]
          }
        ];
      } else {
        const textContent = await readFileAsText(file);
        content = [
          {
            parts: [
              {
                text: `Analysez ce texte qui contient une liste de boissons avec des calculs mathématiques :
                
                ${textContent}
                
                Le format est généralement : NOM_BOISSON(nombre1+nombre2+nombre3+...)
                
                Votre tâche :
                1. Identifiez chaque nom de boisson
                2. Calculez la somme des nombres entre parenthèses pour chaque boisson
                3. Retournez le résultat UNIQUEMENT sous ce format JSON exact :
                [{"name": "Flag", "quantity": 19}, {"name": "Castel", "quantity": 29}]
                
                Ne retournez rien d'autre que le JSON, pas d'explication, pas de texte supplémentaire.`
              }
            ]
          }
        ];
      }

      console.log("Envoi de la requête à l'API Gemini...");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCNPGOb71RMeo_XGb0xcnPwXC6RkgQlJ6I`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: content
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API:", errorData);
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Réponse reçue de Gemini:", data);
      
      setProgressValue(100);
      
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        console.log("Texte de réponse Gemini:", text);
        
        try {
          let cleanText = text.trim();
          cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          
          const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            cleanText = jsonMatch[0];
          }
          
          console.log("Texte nettoyé pour parsing:", cleanText);
          
          const parsedResults = JSON.parse(cleanText);
          
          if (Array.isArray(parsedResults) && parsedResults.length > 0) {
            console.log("Résultats parsés avec succès:", parsedResults);
            setResults(parsedResults);
            
            // Ajouter les nouvelles boissons et mettre à jour les quantités
            await addNewBoissonsAndUpdateStock(parsedResults);
            
            toast({
              title: "Analyse réussie ✨",
              description: `${parsedResults.length} boissons analysées et mises à jour dans le stock.`,
            });
          } else {
            throw new Error("Format de réponse invalide");
          }
        } catch (parseError) {
          console.error("Erreur de parsing JSON:", parseError);
          setErrorMessage("L'IA n'a pas pu analyser correctement le fichier. Vérifiez le format des données.");
          toast({
            title: "Erreur d'analyse",
            description: "Impossible d'analyser les résultats. Vérifiez le format du fichier.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Réponse invalide de l'API");
      }
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue lors du traitement.");
      toast({
        title: "Erreur de traitement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du traitement.",
        variant: "destructive",
      });
    } finally {
      cleanupProgress();
      setProcessing(false);
    }
  };

  // Fonction pour ajouter de nouvelles boissons et mettre à jour les quantités
  const addNewBoissonsAndUpdateStock = async (results: {name: string, quantity: number}[]) => {
    let updatedBoissons = [...boissons];
    let nextId = Math.max(...boissons.map(b => b.id), 0) + 1;
    let addedCount = 0;
    let updatedCount = 0;
    
    // Étape 1: Ajouter toutes les nouvelles boissons nécessaires
    results.forEach(result => {
      const existingBoisson = boissons.find(boisson => {
        const boissonName = boisson.nom.toLowerCase().trim();
        const resultName = result.name.toLowerCase().trim();
        
        if (boissonName === resultName) return true;
        if (boissonName.includes(resultName) || resultName.includes(boissonName)) return true;
        
        return false;
      });
      
      if (!existingBoisson) {
        // Ajouter une nouvelle boisson avec toutes les propriétés nécessaires
        const newBoisson = {
          id: nextId++,
          nom: result.name,
          prix: 500, // Prix par défaut
          trous: 12, // Trous par défaut  
          type: "casier" as const // Type par défaut
        };
        
        updatedBoissons.push(newBoisson);
        console.log(`Nouvelle boisson ajoutée: ${newBoisson.nom} avec ID: ${newBoisson.id}`);
        addedCount++;
      }
    });
    
    // Étape 2: Mettre à jour la liste des boissons si de nouvelles ont été ajoutées
    if (addedCount > 0) {
      console.log("Mise à jour de la liste des boissons avec les nouvelles boissons...");
      updateBoissons(updatedBoissons);
      
      // Attendre que le contexte soit mis à jour
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Étape 3: Mettre à jour toutes les quantités (existantes et nouvelles)
    results.forEach(result => {
      // Chercher dans la liste mise à jour
      const targetBoisson = updatedBoissons.find(boisson => {
        const boissonName = boisson.nom.toLowerCase().trim();
        const resultName = result.name.toLowerCase().trim();
        
        if (boissonName === resultName) return true;
        if (boissonName.includes(resultName) || resultName.includes(boissonName)) return true;
        
        return false;
      });
      
      if (targetBoisson) {
        console.log(`Mise à jour de la quantité pour ${targetBoisson.nom} (ID: ${targetBoisson.id}) -> quantité: ${result.quantity}`);
        updateStockItem(targetBoisson.id, result.quantity);
        updatedCount++;
      } else {
        console.warn(`Boisson non trouvée pour mise à jour: ${result.name}`);
      }
    });
    
    console.log(`${updatedCount} boissons mises à jour, ${addedCount} nouvelles boissons ajoutées`);
    
    if (addedCount > 0) {
      toast({
        title: "Nouvelles boissons détectées",
        description: `${addedCount} nouvelle(s) boisson(s) ajoutée(s) avec des paramètres par défaut (prix: 500 FCFA, trous: 12, type: casier).`,
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="info-box bg-blue-50/50 border-blue-200 p-4 rounded-md">
        <h3 className="font-medium mb-2 flex items-center">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 mr-2">i</span>
          Comment ça marche ?
        </h3>
        <p className="text-sm text-gray-600">
          Téléchargez une image ou un fichier texte contenant vos calculs au format suivant:
        </p>
        <div className="bg-white/80 rounded-md p-3 mt-2 text-sm font-mono">
          <div>Flag(2+5+3+9)</div>
          <div>Castel(5+8+9+7)</div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          L'IA calculera automatiquement les sommes et mettra à jour UNIQUEMENT les quantités dans votre stock.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div
          className={`border-2 ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-dashed border-gray-200'} rounded-xl transition-all duration-200 hover:border-indigo-300`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            onChange={onFileChange}
            className="hidden"
            accept="image/*,text/plain"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full p-8 cursor-pointer"
          >
            <div className={`w-16 h-16 mb-3 rounded-full bg-indigo-50 flex items-center justify-center ${dragActive ? 'animate-pulse' : ''}`}>
              <Upload size={24} className="text-indigo-500" />
            </div>
            <p className="text-lg font-medium text-gray-800 mb-1">
              {file ? `Fichier: ${file.name}` : "Déposez votre fichier ici"}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              ou <span className="text-indigo-600 font-medium">parcourir</span> votre appareil
            </p>
            <div className="flex gap-2 text-xs text-gray-500">
              <span className="flex items-center"><Image size={14} className="mr-1" /> Images</span>
              <span className="flex items-center"><FileText size={14} className="mr-1" /> Fichiers texte</span>
            </div>
          </label>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {preview && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm font-medium mb-2 text-gray-700">Aperçu de l'image:</p>
            <div className="flex justify-center">
              <img 
                src={preview} 
                alt="Aperçu du fichier" 
                className="max-h-[250px] rounded-md shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          </div>
        )}

        {processing && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Analyse en cours...</p>
              <span className="text-xs text-gray-500">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={processWithGemini} 
            disabled={!file || processing}
            className={`relative overflow-hidden ${processing ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'} text-white px-8 py-2 shadow-lg transition-all`}
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <span className="mr-2">Analyser et Calculer</span>
                <Brain className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <Card className="overflow-hidden border-green-100">
              <CardContent className="p-0">
                <div className="bg-green-50 py-3 px-4 border-b border-green-100">
                  <h3 className="text-lg font-medium text-green-800 flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 mr-2">✓</span>
                    Quantités calculées et mises à jour
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {results.length} boisson(s) analysée(s)
                  </p>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50/50">
                        <th className="text-left p-3 font-medium text-green-800">Boisson</th>
                        <th className="text-center p-3 font-medium text-green-800">Quantité calculée</th>
                        <th className="text-right p-3 font-medium text-green-800">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map((result, index) => {
                        const matchedBoisson = boissons.find(boisson => {
                          const boissonName = boisson.nom.toLowerCase().trim();
                          const resultName = result.name.toLowerCase().trim();
                          return boissonName === resultName || 
                                 boissonName.includes(resultName) || 
                                 resultName.includes(boissonName);
                        });
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 font-medium">{result.name}</td>
                            <td className="text-center p-3 font-bold">{result.quantity}</td>
                            <td className="text-right p-3">
                              {matchedBoisson ? (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  ✓ Mis à jour
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                  Nouveau produit ajouté
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICalculation;
