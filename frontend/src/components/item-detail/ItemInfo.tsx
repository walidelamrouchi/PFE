
import React, { useState } from 'react';
import { Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ItemInfoProps {
  title: string;
  description: string;
  category: string;
  location?: string;
  date?: string;
  status: 'lost' | 'found';
  contactMethod?: 'email' | 'phone' | 'both';
  contactEmail?: string;
  contactPhone?: string;
  userId?: string; // Owner's user ID
}

const ItemInfo = ({ 
  title, 
  description, 
  category, 
  location, 
  date, 
  status,
  contactMethod = 'email',
  contactEmail = 'utilisateur@example.com',
  contactPhone = '+33 6 12 34 56 78',
  userId
}: ItemInfoProps) => {
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if the current user is the owner of this item
  const isOwner = user && userId && user.id === userId;

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message vide",
        description: "Veuillez écrire un message avant d'envoyer.",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Prepare message data based on contact method
      const messageData = {
        itemTitle: title,
        message: message,
        recipientEmail: contactMethod === 'email' || contactMethod === 'both' ? contactEmail : null,
        recipientPhone: contactMethod === 'phone' || contactMethod === 'both' ? contactPhone : null,
        contactMethod,
      };
      
      // In a real implementation, this would call a backend endpoint
      // For now, we'll simulate sending and log the data
      console.log('Sending message data:', messageData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let successMessage = "Votre message a été envoyé";
      
      if (contactMethod === 'email') {
        successMessage += " par email";
      } else if (contactMethod === 'phone') {
        successMessage += " par SMS";
      } else if (contactMethod === 'both') {
        successMessage += " par email et SMS";
      }
      
      successMessage += ". Vous serez contacté prochainement.";
      
      toast({
        title: "Message envoyé",
        description: successMessage,
      });
      
      setContactOpen(false);
      setMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'lost' 
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            {status === 'lost' ? 'Perdu' : 'Trouvé'}
          </span>
          <span className="text-sm text-muted-foreground">{category}</span>
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="space-y-4 mb-8">
        {location && (
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Lieu</span>
              <p className="text-muted-foreground">{location}</p>
            </div>
          </div>
        )}
        
        {date && (
          <div className="flex items-start">
            <Calendar className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Date</span>
              <p className="text-muted-foreground">{date}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4">
        {isOwner ? (
          <Alert className="bg-muted">
            <AlertDescription>
              Vous êtes le déclarant de cet objet. Vous pouvez le modifier ou le supprimer dans la section "Mes Objets".
            </AlertDescription>
          </Alert>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => setContactOpen(true)}
          >
            Contacter {status === 'lost' ? 'le propriétaire' : 'la personne qui a trouvé cet objet'}
          </Button>
        )}
      </div>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter pour "{title}"</DialogTitle>
            <DialogDescription>
              Laissez un message à {status === 'lost' ? 'la personne qui a perdu cet objet' : 'la personne qui a trouvé cet objet'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              {(contactMethod === 'email' || contactMethod === 'both') && contactEmail && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span className="text-sm">{contactEmail}</span>
                </div>
              )}
              {(contactMethod === 'phone' || contactMethod === 'both') && contactPhone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span className="text-sm">{contactPhone}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {contactMethod === 'email' 
                  ? 'Votre message sera envoyé par email.' 
                  : contactMethod === 'phone'
                    ? 'Votre message sera envoyé par SMS.'
                    : 'Votre message sera envoyé par email et SMS.'}
              </p>
              
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..." 
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button variant="outline" onClick={() => setContactOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le message'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemInfo;
