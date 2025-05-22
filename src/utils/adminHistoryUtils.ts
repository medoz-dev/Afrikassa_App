
interface AdminChangeItem {
  date: string;
  section: string;
  action: string;
  details: string;
}

/**
 * Enregistre une modification administrative dans l'historique
 */
export const trackAdminChange = (section: string, action: string, details: string) => {
  try {
    // Créer l'élément d'historique
    const changeItem: AdminChangeItem = {
      date: new Date().toISOString(),
      section,
      action,
      details
    };
    
    // Récupérer l'historique existant
    let adminHistory: AdminChangeItem[] = [];
    const existingHistory = localStorage.getItem('adminChangeHistory');
    
    if (existingHistory) {
      adminHistory = JSON.parse(existingHistory);
    }
    
    // Ajouter le nouvel élément et sauvegarder
    adminHistory.push(changeItem);
    localStorage.setItem('adminChangeHistory', JSON.stringify(adminHistory));
    
    console.log('Modification administrative enregistrée:', changeItem);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la modification:", error);
    return false;
  }
};
