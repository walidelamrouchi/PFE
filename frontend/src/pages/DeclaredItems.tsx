
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { allItemsData, ItemType } from '@/services/itemsData';
import { useToast } from "@/hooks/use-toast";

const DeclaredItems = () => {
  const [items, setItems] = useState<ItemType[]>(allItemsData);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>(allItemsData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for newly declared items on component mount
    checkForNewItems();
  }, []);

  useEffect(() => {
    applyTabFilter(activeTab);
  }, [activeTab, items]);

  const applyTabFilter = (tab: string) => {
    if (tab === 'all') {
      setFilteredItems(items);
    } else if (tab === 'lost') {
      setFilteredItems(items.filter(item => item.status === 'lost'));
    } else if (tab === 'found') {
      setFilteredItems(items.filter(item => item.status === 'found'));
    }
  };

  const handleSearch = (query: string, filters: any) => {
    setIsLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      let results = [...items];
      
      // Apply tab filter first
      if (activeTab !== 'all') {
        results = results.filter(item => item.status === activeTab);
      }
      
      // Filtrer par texte de recherche
      if (query) {
        const searchTerms = query.toLowerCase();
        results = results.filter(
          item => 
            item.title.toLowerCase().includes(searchTerms) || 
            item.description.toLowerCase().includes(searchTerms) ||
            (item.location && item.location.toLowerCase().includes(searchTerms)) ||
            item.category.toLowerCase().includes(searchTerms)
        );
      }
      
      // Filtrer par catégorie
      if (filters.category && filters.category !== 'all') {
        results = results.filter(item => 
          item.category === filters.category
        );
      }
      
      // Filtrer par lieu
      if (filters.location) {
        const locationTerms = filters.location.toLowerCase();
        results = results.filter(item => 
          item.location && item.location.toLowerCase().includes(locationTerms)
        );
      }
      
      // Filtrer par date
      if (filters.date) {
        // Convertir le format de date pour la comparaison
        const filterDate = new Date(filters.date).toLocaleDateString('fr-FR');
        results = results.filter(item => 
          item.date === filterDate
        );
      }
      
      setFilteredItems(results);
      setIsLoading(false);
    }, 500);
  };

  // Check for newly declared items on component mount and when sessionStorage changes
  useEffect(() => {
    // Setup event listener for storage changes
    window.addEventListener('storage', checkForNewItems);
    
    // Setup interval to periodically check for new items
    const checkInterval = setInterval(checkForNewItems, 2000);
    
    return () => {
      window.removeEventListener('storage', checkForNewItems);
      clearInterval(checkInterval);
    };
  }, [items]);
  
  const checkForNewItems = () => {
    // Check if there's a newly declared item in session storage
    const newItemData = sessionStorage.getItem('newlyDeclaredItem');
    
    if (newItemData) {
      try {
        const newItem = JSON.parse(newItemData);
        
        // Check if the item is already in the list to avoid duplicates
        const isDuplicate = items.some(item => item.id === newItem.id);
        
        if (!isDuplicate) {
          // Add the new item to the list
          setItems(prevItems => [newItem, ...prevItems]);
          
          toast({
            title: "Nouvel objet ajouté",
            description: `"${newItem.title}" a été ajouté à la liste.`,
          });
        }
      } catch (error) {
        console.error("Error processing new item:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Objets Déclarés</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parcourez la liste des objets perdus et trouvés sur le campus. Vous pouvez filtrer les résultats pour trouver plus facilement ce que vous cherchez.
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous les objets</TabsTrigger>
              <TabsTrigger value="lost">Objets perdus</TabsTrigger>
              <TabsTrigger value="found">Objets trouvés</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <SearchBar onSearch={handleSearch} />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-primary animate-spin" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  category={item.category}
                  location={item.location}
                  date={item.date}
                  imageUrl={item.imageUrl}
                  status={item.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou consultez plus tard.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeclaredItems;
