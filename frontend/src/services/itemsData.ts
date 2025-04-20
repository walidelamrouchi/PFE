
export interface ItemType {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  date?: string;
  imageUrl?: string;
  status: 'lost' | 'found';
  contactMethod?: 'email' | 'phone' | 'both';
  contactEmail?: string;
  contactPhone?: string;
  userId?: string;
  user_id?: unknown; // Add this to handle potential type variations
}

// Combined data from both lost and found items for demo
export const allItemsData: ItemType[] = [
  // Lost items
  {
    id: '1',
    title: 'Ordinateur portable HP',
    description: 'Ordinateur portable HP Pavilion argenté avec autocollants sur le couvercle.',
    category: 'Électronique',
    location: 'Bibliothèque centrale',
    date: '02/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    status: 'lost',
    contactMethod: 'email',
    contactEmail: 'user1@example.com',
  },
  {
    id: '4',
    title: 'Lunettes de vue noires',
    description: 'Lunettes de vue à monture noire de marque Ray-Ban dans un étui gris.',
    category: 'Accessoires',
    location: 'Amphithéâtre principal',
    date: '08/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371',
    status: 'lost',
    contactMethod: 'both',
    contactEmail: 'user2@example.com',
    contactPhone: '+33 6 12 34 56 78',
  },
  {
    id: '5',
    title: 'Manuel de physique',
    description: 'Manuel de physique quantique avec notes personnelles et marque-pages.',
    category: 'Documents',
    location: 'Salle d\'étude, Bâtiment C',
    date: '01/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
    status: 'lost',
    contactMethod: 'email',
    contactEmail: 'student@university.edu',
  },
  {
    id: '6',
    title: 'Portefeuille marron',
    description: 'Portefeuille en cuir marron contenant carte d\'identité et cartes bancaires.',
    category: 'Accessoires',
    location: 'Cafétéria',
    date: '07/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    status: 'lost',
    contactMethod: 'phone',
    contactPhone: '+33 7 98 76 54 32',
  },
  {
    id: '7',
    title: 'AirPods Pro',
    description: 'Écouteurs sans fil Apple AirPods Pro avec boîtier de chargement.',
    category: 'Électronique',
    location: 'Terrain de sport',
    date: '03/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5',
    status: 'lost',
  },
  {
    id: '8',
    title: 'Écharpe bleu marine',
    description: 'Écharpe bleu marine en laine avec motifs géométriques.',
    category: 'Vêtements',
    location: 'Entrée principale',
    date: '06/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9',
    status: 'lost',
  },

  // Found items
  {
    id: '2',
    title: 'Clés avec porte-clés rouge',
    description: 'Trousseau de 3 clés avec un porte-clés rouge en forme de cœur.',
    category: 'Accessoires',
    location: 'Cafétéria',
    date: '05/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1622835343579-5a6a75e9c6a3',
    status: 'found',
    contactMethod: 'both',
    contactEmail: 'finder1@example.com',
    contactPhone: '+33 6 11 22 33 44',
  },
  {
    id: '3',
    title: 'Carte d\'étudiant',
    description: 'Carte d\'étudiant au nom de Mohammed Alaoui, département Informatique.',
    category: 'Documents',
    location: 'Salle 204, Bâtiment A',
    date: '10/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    status: 'found',
    contactMethod: 'email',
    contactEmail: 'staff@university.edu',
  },
  {
    id: '9',
    title: 'Montre Casio',
    description: 'Montre digitale Casio noire avec bracelet en résine.',
    category: 'Accessoires',
    location: 'Vestiaire du gymnase',
    date: '11/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1619134778706-7015533a6150',
    status: 'found',
  },
  {
    id: '10',
    title: 'USB Flash Drive 32GB',
    description: 'Clé USB SanDisk 32GB noire et rouge.',
    category: 'Électronique',
    location: 'Salle informatique',
    date: '09/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1589825743144-c9e705f843ba',
    status: 'found',
  },
  {
    id: '11',
    title: 'Étui à lunettes bleu',
    description: 'Étui à lunettes rigide de couleur bleue sans marque apparente.',
    category: 'Accessoires',
    location: 'Bibliothèque, section sciences',
    date: '08/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1622835357473-21228339830c',
    status: 'found',
  },
  {
    id: '12',
    title: 'Bouteille d\'eau isolante',
    description: 'Bouteille d\'eau en acier inoxydable de couleur rouge, marque Thermos.',
    category: 'Autre',
    location: 'Salle de conférence B',
    date: '06/05/2023',
    imageUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba',
    status: 'found',
  },
];

export const getItemById = (id: string): Promise<ItemType | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = allItemsData.find(item => item.id === id);
      resolve(item);
    }, 500);
  });
};
