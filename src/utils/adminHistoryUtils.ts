
interface AdminChangeItem {
  date: string;
  section: string;
  action: string;
  details: string;
  before?: any;
  after?: any;
}

/**
 * Enregistre une modification administrative dans l'historique
 */
export const trackAdminChange = (
  section: string, 
  action: string, 
  details: string,
  beforeData?: any,
  afterData?: any
) => {
  try {
    // Créer l'élément d'historique
    const changeItem: AdminChangeItem = {
      date: new Date().toISOString(),
      section,
      action,
      details,
      before: beforeData,
      after: afterData
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
