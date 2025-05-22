import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Image, FileText, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  const { boissons, updateStockItem } = useAppContext();

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
    
    // Create a preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result as string);
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
    const cleanupProgress = simulateProgress();

    try {
      // Convert image to base64 if it's an image
      const base64 = await fileToBase64(file);

      // Prepare the content based on file type
      let content: any = [];
      
      if (file.type.startsWith('image/')) {
        content = [
          {
            parts: [
              {
                text: `Voici une image contenant une liste de boissons avec des calculs. 
                Chaque ligne est au format: NOM_BOISSON(calcul) 
                Par exemple: Flag(2+5+3+9), Castel(5+8+9+7), etc.
                Calcule la somme pour chaque boisson et donne-moi les résultats sous forme de liste.
                Format de réponse souhaité: [{nom: "Flag", quantite: 19}, {nom: "Castel", quantite: 29}]`
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64.split(',')[1] // Remove the data:image/jpeg;base64, part
                }
              }
            ]
          }
        ];
      } else {
        // For text files, read the content
        const textContent = await readFileAsText(file);
        content = [
          {
            parts: [
              {
                text: `Voici une liste de boissons avec des calculs:
                ${textContent}
                Chaque ligne est au format: NOM_BOISSON(calcul)
                Par exemple: Flag(2+5+3+9), Castel(5+8+9+7), etc.
                Calcule la somme pour chaque boisson et donne-moi les résultats sous forme de liste.
                Format de réponse souhaité: [{nom: "Flag", quantite: 19}, {nom: "Castel", quantite: 29}]`
              }
            ]
          }
        ];
      }

      // Make API request to Gemini
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
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Complete the progress bar
      setProgressValue(100);
      
      // Parse the response to extract results
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        console.log("Gemini response:", text);
        
        // Try to extract JSON from the response
        try {
          // Look for array pattern in the text
          const jsonMatch = text.match(/(\[.*?\])/s);
          if (jsonMatch && jsonMatch[1]) {
            const extractedJson = jsonMatch[1].replace(/'/g, '"');
            const parsedResults = JSON.parse(extractedJson);
            setResults(parsedResults);
            
            // Update stock items based on the results
            updateStockItemsFromResults(parsedResults);
            
            toast({
              title: "Analyse réussie ✨",
              description: `${parsedResults.length} boissons traitées avec succès.`,
            });
          } else {
            // Fallback: try to parse manually
            const manualResults = parseManualResults(text);
            if (manualResults.length > 0) {
              setResults(manualResults);
              updateStockItemsFromResults(manualResults);
              toast({
                title: "Analyse réussie ✨",
                description: `${manualResults.length} boissons traitées avec succès.`,
              });
            } else {
              throw new Error("Format de réponse non reconnu");
            }
          }
        } catch (error) {
          console.error("Error parsing Gemini results:", error);
          toast({
            title: "Erreur d'analyse",
            description: "Impossible d'analyser les résultats de l'IA. Veuillez essayer à nouveau.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Réponse invalide de l'API");
      }
    } catch (error) {
      console.error("Error processing with Gemini:", error);
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

  // Helper function to update stock items based on AI results
  const updateStockItemsFromResults = (results: {name: string, quantity: number}[]) => {
    results.forEach(result => {
      // Try to find matching boisson by name (case insensitive)
      const matchedBoisson = boissons.find(
        boisson => boisson.nom.toLowerCase() === result.name.toLowerCase()
      );
      
      if (matchedBoisson) {
        // Update the stock item with the calculated quantity
        updateStockItem(matchedBoisson.id, result.quantity);
      }
    });
  };

  // Helper function to parse results manually if JSON parsing fails
  const parseManualResults = (text: string): {name: string, quantity: number}[] => {
    const results: {name: string, quantity: number}[] = [];
    
    // Try to match patterns like "Nom: Quantité" or "Nom - Quantité"
    const lines = text.split('\n');
    for (const line of lines) {
      // Try different separators
      const separators = [':', '-', '=', ','];
      for (const separator of separators) {
        if (line.includes(separator)) {
          const [name, quantityStr] = line.split(separator).map(s => s.trim());
          const quantity = parseInt(quantityStr);
          if (name && !isNaN(quantity)) {
            results.push({ name, quantity });
            break;
          }
        }
      }
    }
    
    return results;
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
          L'IA calculera automatiquement les sommes et mettra à jour votre stock.
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
                <span className="mr-2">Lancer l'analyse</span>
                <Brain className="h-5 w-5" />
              </>
            )}
            
            {!processing && (
              <span className="absolute right-0 -mt-12 -mr-12 h-24 w-24 rounded-full bg-white opacity-10 transform rotate-45 group-hover:scale-150 transition-transform duration-700 ease-in-out"></span>
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
                    Résultats de l'analyse
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {results.length} élément(s) analysé(s) avec succès
                  </p>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50/50">
                        <th className="text-left p-3 font-medium text-green-800">Boisson</th>
                        <th className="text-center p-3 font-medium text-green-800">Quantité</th>
                        <th className="text-right p-3 font-medium text-green-800">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.map((result, index) => {
                        const matchedBoisson = boissons.find(
                          boisson => boisson.nom.toLowerCase() === result.name.toLowerCase()
                        );
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="p-3 font-medium">{result.name}</td>
                            <td className="text-center p-3">{result.quantity}</td>
                            <td className="text-right p-3">
                              {matchedBoisson ? (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  Mise à jour
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                  Non trouvé
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
