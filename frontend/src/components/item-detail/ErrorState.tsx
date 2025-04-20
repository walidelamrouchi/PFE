
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2>
      <p className="text-muted-foreground mb-6">
        L'objet que vous recherchez n'a pas été trouvé dans notre base de données. 
        Il est possible qu'il ait été supprimé ou que l'URL soit incorrecte.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link to="/objects">Voir tous les objets</Link>
        </Button>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
