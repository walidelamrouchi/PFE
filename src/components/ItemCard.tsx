import { useState } from 'react';
import { Calendar, MapPin, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  date?: string;
  imageUrl?: string;
  status: 'lost' | 'found';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const ItemCard = ({
  id,
  title,
  description,
  category,
  location,
  date,
  imageUrl,
  status,
  onEdit,
  onDelete,
  showActions = false,
}: ItemCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card className="overflow-hidden hover-card">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">Aucune image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'lost' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            {status === 'lost' ? 'Perdu' : 'Trouvé'}
          </span>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {category}
        </div>
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex flex-col gap-2">
        {location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
        {date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button className="w-full" variant="outline" asChild>
          <Link to={`/item/${id}`}>
            <ExternalLink size={16} className="mr-2" />
            Voir les détails
          </Link>
        </Button>
        
        {showActions && (
          <div className="flex gap-2 w-full">
            {onEdit && (
              <Button className="flex-1" variant="secondary" onClick={() => onEdit(id)}>
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button className="flex-1" variant="destructive" onClick={() => onDelete(id)}>
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard; 