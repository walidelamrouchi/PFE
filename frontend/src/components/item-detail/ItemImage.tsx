
import React from 'react';

interface ItemImageProps {
  imageUrl?: string;
  title: string;
}

const ItemImage = ({ imageUrl, title }: ItemImageProps) => {
  return (
    <div className="bg-muted rounded-lg overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-auto object-cover aspect-[4/3]" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center aspect-[4/3] bg-muted">
          <span className="text-muted-foreground">Aucune image disponible</span>
        </div>
      )}
    </div>
  );
};

export default ItemImage;
