
import { FormLabel } from "@/components/ui/form";
import ImageUploader from "../ImageUploader";

interface ImageSectionProps {
  onImageUpload: (url: string) => void;
  initialImageUrl: string | null;
  disabled?: boolean;
}

const ImageSection = ({ onImageUpload, initialImageUrl, disabled = false }: ImageSectionProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Image de l'objet (optionnel)</FormLabel>
      <ImageUploader 
        onImageUpload={onImageUpload} 
        initialImageUrl={initialImageUrl}
        disabled={disabled}
      />
    </div>
  );
};

export default ImageSection;
