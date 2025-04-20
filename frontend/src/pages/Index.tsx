import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import ItemCard from '@/components/ItemCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ItemType } from '@/services/itemsData';

const Index = () => {
  const [recentItems, setRecentItems] = useState<ItemType[]>([
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
      id: '4',
      title: 'Lunettes de vue noires',
      description: 'Lunettes de vue à monture noire de marque Ray-Ban dans un étui gris.',
      category: 'Accessoires',
      location: 'Amphithéâtre principal',
      date: '08/05/2023',
      imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371',
      status: 'lost' as const,
    }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Vérifier s'il y a un nouvel objet dans sessionStorage
    const newItemData = sessionStorage.getItem('newlyDeclaredItem');
    
    if (newItemData) {
      try {
        const newItem = JSON.parse(newItemData);
        
        // Vérifier si l'objet n'est pas déjà dans la liste
        const isDuplicate = recentItems.some(item => item.id === newItem.id);
        
        if (!isDuplicate) {
          // Ajouter le nouvel objet au début de la liste
          setRecentItems(prevItems => [newItem, ...prevItems.slice(0, 3)]);
        }
      } catch (error) {
        console.error("Erreur lors du traitement du nouvel objet:", error);
      }
    }
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Déclarez votre objet',
      description: 'Remplissez un formulaire simple en décrivant l\'objet perdu ou trouvé avec une photo si possible.',
    },
    {
      number: '02',
      title: 'Système de correspondance',
      description: 'Notre système intelligent vous aide à trouver des correspondances potentielles avec d\'autres objets.',
    },
    {
      number: '03',
      title: 'Contactez et récupérez',
      description: 'Une fois la correspondance établie, organisez la récupération directement avec l\'autre personne.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Section objets récents */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="section-title">Objets récemment déclarés</h2>
              <p className="section-subtitle mx-auto">
                Consultez les derniers objets perdus et trouvés sur le campus. 
                Peut-être reconnaîtrez-vous quelque chose !
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="gap-1">
                  <Link to="/objects">
                    Voir tous les objets perdus
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild className="gap-1">
                  <Link to="/objects">
                    Voir tous les objets trouvés
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section comment ça marche */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="section-title">Comment ça marche</h2>
              <p className="section-subtitle mx-auto">
                Retrouver un objet perdu ou rendre un objet trouvé n'a jamais été aussi simple. 
                Suivez ces étapes pour utiliser notre plateforme.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="glass-panel p-8 flex flex-col items-center text-center hover-card">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/declare-item">
                  Déclarer un objet maintenant
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Section appel à l'action */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-400/10" />
            <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-400/5 blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Vous avez perdu ou trouvé un objet sur le campus ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et aidez-nous à réunir les objets perdus avec leurs propriétaires. 
              Ensemble, nous pouvons faire une différence !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/objects">
                  Je cherche un objet
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/declare-item">
                  J'ai trouvé un objet
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
