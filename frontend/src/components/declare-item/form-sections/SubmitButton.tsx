
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  isEditing: boolean;
}

const SubmitButton = ({ isLoading, isEditing }: SubmitButtonProps) => {
  return (
    <Button disabled={isLoading} type="submit" className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? 'Mise à jour en cours...' : 'Soumission en cours...'}
        </>
      ) : (
        isEditing ? 'Mettre à jour l\'objet' : 'Déclarer l\'objet'
      )}
    </Button>
  );
};

export default SubmitButton;
