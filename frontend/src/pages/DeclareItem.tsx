
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemDeclarationForm from '@/components/declare-item/ItemDeclarationForm';

const DeclareItem = () => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get the edit parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const editItemId = searchParams.get('edit');

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour déclarer un objet perdu ou trouvé.",
      });
      navigate('/sign-in');
      return;
    }

    // If we have an item ID to edit, fetch the item data
    if (editItemId && user) {
      fetchItemToEdit(editItemId);
    }
  }, [authLoading, user, navigate, editItemId]);

  const fetchItemToEdit = async (itemId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setItemToEdit(data);
        setIsEditing(true);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Objet non trouvé ou vous n'avez pas les droits pour le modifier.",
        });
        navigate('/my-items');
      }
    } catch (error) {
      console.error('Error fetching item to edit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'objet à modifier.",
      });
      navigate('/my-items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Use the registered email if no custom email is provided
      const contactEmail = formData.email || user.email;
      
      // Updating an existing item
      if (isEditing && itemToEdit) {
        const { error } = await supabase
          .from('items')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            type: formData.type,
            location: formData.location,
            date: formData.date,
            image_url: formData.imageUrl,
            email: contactEmail,
          })
          .eq('id', itemToEdit.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Votre objet a été mis à jour avec succès.",
        });
      } 
      // Creating a new item
      else {
        const { error } = await supabase.from('items').insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          type: formData.type,
          location: formData.location,
          date: formData.date,
          image_url: formData.imageUrl,
          email: contactEmail,
        });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Votre objet a été déclaré avec succès.",
        });
      }

      // Navigate back to my items
      navigate('/my-items');
    } catch (error) {
      console.error('Error submitting item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: isEditing 
          ? "Une erreur est survenue lors de la mise à jour de l'objet." 
          : "Une erreur est survenue lors de la déclaration de l'objet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? "Modifier un objet" : "Déclarer un objet perdu ou trouvé"}
        </h1>
        
        {isLoading && !itemToEdit ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <ItemDeclarationForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            initialData={itemToEdit}
            isEditing={isEditing}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DeclareItem;
