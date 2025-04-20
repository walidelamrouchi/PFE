
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingState from '@/components/item-detail/LoadingState';
import ErrorState from '@/components/item-detail/ErrorState';
import ItemContent from '@/components/item-detail/ItemContent';
import { getItemById, ItemType } from '@/services/itemsData';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    if (!id) {
      setError("Identifiant d'objet manquant");
      setLoading(false);
      return;
    }
    
    // Check if it's a newly declared item from session storage
    const newItemData = sessionStorage.getItem('newlyDeclaredItem');
    
    if (newItemData) {
      try {
        const newItem = JSON.parse(newItemData);
        
        if (newItem.id === id) {
          // We found the item in session storage
          setItem(newItem);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error parsing new item data:", error);
      }
    }
    
    // If not found in session storage, find the item in our data
    getItemById(id).then((foundItem) => {
      if (foundItem) {
        // Safely convert user_id to string, defaulting to an empty string if not a string
        const processedItem = {
          ...foundItem,
          userId: typeof foundItem.user_id === 'string' ? foundItem.user_id : ''
        };
        
        setItem(processedItem);
        setLoading(false);
      } else {
        setError("Cet objet n'existe pas ou a été supprimé");
        setLoading(false);
      }
    });
    
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : item && (
          <ItemContent item={item} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ItemDetail;
