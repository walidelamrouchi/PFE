
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemCard from '@/components/ItemCard';
import DeleteItemDialog from '@/components/DeleteItemDialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MyItems = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour voir vos objets.",
      });
      navigate('/sign-in');
      return;
    }

    if (user) {
      fetchUserItems();
      
      // Set up real-time subscription for items table changes
      console.log('Setting up real-time subscription for user:', user.id);
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'items',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          console.log('Real-time update received:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            // Add new item to the list
            setItems(currentItems => {
              console.log('Adding new item to list:', payload.new);
              // Check if the item matches the current filter
              if (activeTab !== 'all' && payload.new.type !== activeTab) {
                console.log('Item doesn\'t match current filter:', activeTab);
                return currentItems;
              }
              return [payload.new, ...currentItems];
            });
            toast({
              title: "Nouvel objet ajouté",
              description: "Votre nouvel objet a été ajouté avec succès.",
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing item in the list
            setItems(currentItems => 
              currentItems.map(item => 
                item.id === payload.new.id ? payload.new : item
              )
            );
            toast({
              title: "Objet mis à jour",
              description: "Votre objet a été mis à jour avec succès.",
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted item from the list
            setItems(currentItems => 
              currentItems.filter(item => item.id !== payload.old.id)
            );
            toast({
              title: "Objet supprimé",
              description: "Votre objet a été supprimé avec succès.",
            });
          }
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to real-time updates');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Error subscribing to real-time updates');
          }
        });

      // Clean up subscription when component unmounts
      return () => {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading, navigate, toast]);

  const fetchUserItems = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching items for user:', user?.id);
      console.log('Current active tab:', activeTab);
      
      let query = supabase
        .from('items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (activeTab !== 'all') {
        query = query.eq('type', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Fetched items:', data?.length || 0);
      if (data) {
        console.log('First item:', data[0]);
      }
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching user items:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer vos objets. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items when activeTab changes
  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [activeTab]);

  const handleEditItem = (id: string) => {
    navigate(`/declare-item?edit=${id}`);
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setItemToDelete({
        id: id,
        title: item.title
      });
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemToDelete.id);
        
      if (error) throw error;
      
      // No need to manually update the items list since the real-time subscription will handle it
      toast({
        title: "Succès",
        description: "L'objet a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'objet.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold mb-8">Mes Objets</h1>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="lost">Perdus</TabsTrigger>
            <TabsTrigger value="found">Trouvés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderItemsList()}
          </TabsContent>
          
          <TabsContent value="lost" className="mt-0">
            {renderItemsList()}
          </TabsContent>
          
          <TabsContent value="found" className="mt-0">
            {renderItemsList()}
          </TabsContent>
        </Tabs>
        
        {itemToDelete && (
          <DeleteItemDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDeleteItem}
            itemTitle={itemToDelete.title}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );

  function renderItemsList() {
    if (isLoading) {
      return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[320px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Aucun objet trouvé</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === 'all' 
              ? "Vous n'avez pas encore déclaré d'objets." 
              : activeTab === 'lost' 
                ? "Vous n'avez pas encore déclaré d'objets perdus."
                : "Vous n'avez pas encore déclaré d'objets trouvés."}
          </p>
          <button 
            onClick={() => navigate('/declare-item')}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            Déclarer un objet
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              category={item.category}
              location={item.location}
              date={new Date(item.date).toLocaleDateString('fr-FR')}
              imageUrl={item.image_url}
              status={item.type}
              showActions={true}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
        
        {items.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </>
    );
  }
};

export default MyItems;
