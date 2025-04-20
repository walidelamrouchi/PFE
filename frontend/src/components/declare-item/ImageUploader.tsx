
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  initialImageUrl: string | null;
  disabled?: boolean;
}

const ImageUploader = ({ onImageUpload, initialImageUrl, disabled = false }: ImageUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl);
  
  useEffect(() => {
    setImagePreview(initialImageUrl);
  }, [initialImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onImageUpload(result);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className={`border-2 border-dashed rounded-lg ${
            imagePreview ? 'border-primary' : 'border-border'
          } p-4 flex flex-col items-center justify-center h-40 relative overflow-hidden ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !disabled && document.getElementById('image-upload')?.click()}
        >
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={disabled}
          />
          
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Upload className="h-10 w-10 mb-2" />
              <span className="text-sm">Cliquez pour ajouter une image</span>
              <span className="text-xs">(recommandé)</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Une image claire aidera à l'identification de l'objet.
          </p>
          <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
            <li>Prenez la photo avec un bon éclairage</li>
            <li>Montrez l'objet en entier</li>
            <li>Taille maximale : 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
