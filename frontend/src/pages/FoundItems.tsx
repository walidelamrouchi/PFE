import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';

// Données d'exemple
const foundItemsData = [
  {
    id: '2',
    title: 'Clés avec porte-clés rouge',
    description: 'Trousseau de 3 clés avec un porte-clés rouge en forme de cœur.',
    category: 'Accessoires',
    location: 'Cafétéria',
    date: '05/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1622835343579-5a6a75e9c6a3',
    status: 'found' as const,
  },
  {
    id: '3',
    title: 'Carte d\'étudiant',
    description: 'Carte d\'étudiant au nom de Mohammed Alaoui, département Informatique.',
    category: 'Documents',
    location: 'Salle 204, Bâtiment A',
    date: '10/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    status: 'found' as const,
  },
  {
    id: '9',
    title: 'Montre Casio',
    description: 'Montre digitale Casio noire avec bracelet en résine.',
    category: 'Accessoires',
    location: 'Vestiaire du gymnase',
    date: '11/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1619134778706-7015533a6150',
    status: 'found' as const,
  },
  {
    id: '10',
    title: 'USB Flash Drive 32GB',
    description: 'Clé USB SanDisk 32GB noire et rouge.',
    category: 'Électronique',
    location: 'Salle informatique',
    date: '09/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1589825743147-2a7e8f427272',
    status: 'found' as const,
  },
  {
    id: '11',
    title: 'Étui à lunettes bleu',
    description: 'Étui à lunettes rigide de couleur bleue sans marque apparente.',
    category: 'Accessoires',
    location: 'Bibliothèque, section sciences',
    date: '08/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1622835357473-21228339830c',
    status: 'found' as const,
  },
  {
    id: '12',
    title: 'Bouteille d\'eau isolante',
    description: 'Bouteille d\'eau en acier inoxydable de couleur rouge, marque Thermos.',
    category: 'Autre',
    location: 'Salle de conférence B',
    date: '06/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba',
    status: 'found' as const,
  },
];

const FoundItems = () => {
  const [items] = useState(foundItemsData);
  const [filteredItems, setFilteredItems] = useState(foundItemsData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (query: string, filters: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = [...items];
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Objets Trouvés</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parcourez la liste des objets trouvés sur le campus. Si vous avez perdu un objet similaire,
              vous pouvez contacter la personne qui l'a trouvé.
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

export default FoundItems;
