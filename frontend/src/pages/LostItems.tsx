import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';

// Données d'exemple
const lostItemsData = [
  {
    id: '1',
    title: 'Ordinateur portable HP',
    description: 'Ordinateur portable HP Pavilion argenté avec autocollants sur le couvercle.',
    category: 'Électronique',
    location: 'Bibliothèque centrale',
    date: '02/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    status: 'lost' as const,
  },
  {
    id: '4',
    title: 'Lunettes de vue noires',
    description: 'Lunettes de vue à monture noire de marque Ray-Ban dans un étui gris.',
    category: 'Accessoires',
    location: 'Amphithéâtre principal',
    date: '08/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371',
    status: 'lost' as const,
  },
  {
    id: '5',
    title: 'Manuel de physique',
    description: 'Manuel de physique quantique avec notes personnelles et marque-pages.',
    category: 'Documents',
    location: 'Salle d\'étude, Bâtiment C',
    date: '01/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
    status: 'lost' as const,
  },
  {
    id: '6',
    title: 'Portefeuille marron',
    description: 'Portefeuille en cuir marron contenant carte d\'identité et cartes bancaires.',
    category: 'Accessoires',
    location: 'Cafétéria',
    date: '07/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    status: 'lost' as const,
  },
  {
    id: '7',
    title: 'AirPods Pro',
    description: 'Écouteurs sans fil Apple AirPods Pro avec boîtier de chargement.',
    category: 'Électronique',
    location: 'Terrain de sport',
    date: '03/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5',
    status: 'lost' as const,
  },
  {
    id: '8',
    title: 'Écharpe bleu marine',
    description: 'Écharpe bleu marine en laine avec motifs géométriques.',
    category: 'Vêtements',
    location: 'Entrée principale',
    date: '06/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9',
    status: 'lost' as const,
  },
];

const LostItems = () => {
  const [items] = useState(lostItemsData);
  const [filteredItems, setFilteredItems] = useState(lostItemsData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (query: string, filters: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = [...items];
      
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
      
      if (filters.category && filters.category !== 'all') {
        results = results.filter(item => 
          item.category === filters.category
        );
      }
      
      if (filters.location) {
        const locationTerms = filters.location.toLowerCase();
        results = results.filter(item => 
          item.location && item.location.toLowerCase().includes(locationTerms)
        );
      }
      
      if (filters.date) {
        const filterDate = new Date(filters.date).toLocaleDateString('fr-FR');
        results = results.filter(item => 
          item.date === filterDate
        );
      }
      
      setFilteredItems(results);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Objets Perdus</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parcourez la liste des objets perdus sur le campus. Si vous reconnaissez un objet que vous avez trouvé,
              vous pouvez contacter la personne qui l'a perdu.
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-primary animate-spin" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

export default LostItems;
