
import React from 'react';
import CalculGeneral from '@/components/caisse/CalculGeneral';

const Caisse: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion de la Caisse</h1>
      <CalculGeneral />
    </div>
  );
};

export default Caisse;
