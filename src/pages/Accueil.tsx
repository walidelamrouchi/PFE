import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import ItemCard from '@/components/ItemCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const objetsExemple = [
  {
    id: '1',
    title: 'Ordinateur portable HP',
    description: 'Ordinateur portable HP Pavilion argenté avec autocollants sur le capot.',
    category: 'Électronique',
    location: 'Bibliothèque centrale',
    date: '02/05/2023',
    image_url: 'https://linksolutions.ma/wp-content/uploads/2024/06/7646-hp-5cr15ea-pc-portable-15-da0039nk-i5-7200u-4-go-ddr4-1to-dvd-1563-freedos-5cr15ea-pc-portable-5CR15EA-linksolutions-ma.webp',
    type: 'lost',
  },
  {
    id: '2',
    title: 'Clés avec porte-clés rouge',
    description: 'Trousseau de 3 clés avec un porte-clés rouge en forme de cœur.',
    category: 'Accessoires',
    location: 'Cafétéria',
    date: '05/05/2023',
    image_url: 'data:image/jpeg;base64,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',
    type: 'found',
  },
  {
    id: '3',
    title: "Carte d'étudiant",
    description: "Carte d'étudiant au nom de Mohammed Alaoui, département Informatique.",
    category: 'Documents',
    location: 'Salle 204, Bâtiment A',
    date: '10/05/2023',
    image_url: '',
    type: 'found',
  },
  {
    id: '4',
    title: 'Lunettes de vue noires',
    description: 'Lunettes de vue à monture noire de marque Ray-Ban dans un étui gris.',
    category: 'Accessoires',
    location: 'Amphithéâtre principal',
    date: '08/05/2023',
    image_url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhUUBxMVFRUWGB8ZFxgYFx8aGhkeHR8aGhYZHRgfIyggHRolHx8dITEjMSsrLy8uFx8zPjMtNygtLjABCgoKDg0OFhAQFS0ZFR0tKy0tLS0tLSstLS0rLSstLTctKysrKy0tNzctMi0rKy0tNzctKystNysrNystKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcEBQgCAQP/xABCEAACAQIDBAcEBwUHBQAAAAAAAQIDBAUGEQcSITEiQVFhcYGREzJCoSNSYnKCscEUNFOSohUWJTODlNEkQ2Oyw//EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAQEBAQEAAAAAAAAAAAAAAAARAUEx/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeKtSnRpuVVqKXFtvRLxZCMwbVstYS3G2m7movhorWPnUfR08NQJ0Y99f2eHUHO/qQpxXxTkor1ZRON7WMzYnqsNULWD7OnU/mktPSKIVdyucQr7+JVKlaf1qknJ/PqLEq+sQ2s5Rs5tU6s6zX8KnKS/mekX6mgvNtdtp/h1lVl31JxgvlvEDy/kvG8b0/s+i1B/HLoQ8d5+95aloZc2UYXYpSxqXt5/VWsaa8ucvPRdwmCKraPnfHq25gdCnB/+OnKrJeMn0V5oz6GVdpeLLexG+nR16va7r9KK0+ZbNra29nRULSEYRXKMUopeSP2FVU08O2m5Y6drXV5Bc4S+k+Ukqn8sjZ4BtZw64qezzFTla1E9G3rKnr3vTeh5rRdpYxpMxZUwbMVPTEqScuqpHozX4uvweqA21rc0Lugp2k4zhLipRakn4NcGfqUniuSc0ZKrSrZWrVJU+b9n7346L1jPx0fgj7he2XFLaKWMW0KvbKnJ035xakm/NCJV1gjOTc74Vm6ElYb8KkFrKnNJSSfDeTTaa17+HDXTVEmIoAAAAAAAADxWq06FJyryUYpatt6JLtbfIrHNG1eEKzpZWgqslwdaevs191c5ePBeIFm3FejbUXK4koxXFyk9EvFshk9pWGVcVVLDac60ddJVFwivBP3vkVfKeO5uv4wvqtSvKT6MF0YLte6tEl3li18mUcByjUdJ61kk5SXBJfEo92nXz4FiVYMZKcU48nxR9NLk6/8A7Qy5Sk+ajuvxXA3RFAAAAAAAAACstrOKY7Z4hRp4ZWdKlOm3JrRJvXTjNrVLil5gSTOGe8KyvHdq61az5UoNarvm+UF831JlcXe2PHKkZK2oUYa8n0pNfNJvyIfglGFzikVX470lq336tt6+HzJrY5Ixa/uGrWDjT3mlOo92LWvBrra8FoaiVAcax3E8eq64xXq1OyLekF4QilFehiQlbQhpBaehfOFbMMIorXFfppdmm7H5dJ+vke77ZVlW6T9jCpSfbCo38p7yFFPZessIvKv+LV6lKK5+zoyqPTresdVFd+jLlybl/Jfst/BFTryWms5vfmuxuL9x/hRDsY2PXtp08v3G+1xUZfRz/DUjw18o+JAp3eOYHjP0jnRuIPjJ9GS1+t1Si+3imu0DqIFVYdtgo0bDTFqLlWjwbpOLpz79dej5by7DNtNsGFVv8y2rp/ZdOX5zi/kZirIBBqe1DB5LWpQuoxXOW5BqPjuzbRqs4bV7S1oKGWNKs5LV1JJqFPXq3Xo5T7uCXXryAs4HNKxXNmPV3KlUuqz6/Zupuru3YaRXojPo4Pnup7lG7/FOrH85osSuhyBZ72dWGORlWw9xoV+benQqfeS5P7S49qZXywLaAl0aNz/uKi/+x9/svaLQ4qldf7ms/kq4Em2T5RxfB8bqVsTpunFQcI8V023F69u7w7OwtcoCpiOf7L/Pp3qX+u/nKUkYcdo2a7K4+jrT4c4VVGfk9YqS9QOiwVZlnbLYXUlDMVN0ZfxIayp+cffh/Uu8suxvrTEbZVLCpCpB8pQkpJ+aIrIAIzmnPWBZaTjeVN+r1UqfSn59UfNoCTEOzbtFwXLrcIP29f8AhU3ro/tS5R+b7isMy7QMwZj1hRf7NRfwQfTkvtT5+S0XiR20s40+FJcX6s1mJW0zFmLG82Vf8WnuUtdY0KfCK7N7rk+9/I/TAcBu8VuFTw6GvbpwjFdsn1IlmVdnV5faTxbWlT57v/cl5fD58e4tPDMNs8KtVTsIKEV2dfe3zb7xYNXlLK9rly06Okqsvfnp/SuyP5/lt8QoK5sKkH8UJR9U0ZAMqr/ZFdSrYfVj9SbXrxX5lgEfwvKtrhOLVauHSlBVZb04J9Fvw5IkBdAAEAAAAAAI1nfLH95LOHsZKNSm9Y73GMk9N6EtPhbS9CSgDm2xp1sv50pq+juSpVoby6klNa+K3Xrr2HSRUO3HBvZ1KV3SXCX0VT0bg/TVfhRYWScXWN5WoVm9ZOCjP78ejP5pvzLviN4ACKET2h5So5nwhulFK4ppulLrfW6bf1X8no+0lgA5TsoTddw0er4adeq/Iz6+U8wQ52lw12qlJr1S0M/aTh8sNzpcRtujvSU4/wColKX9TkvItvZPO5WVVTu5ubpyaTb10jwajr2Ljp3aI0ihbrDr7D5f9ZSqUm9dN+Eoarr01S1RI9m2XrfHsejG9WtOL1ceqXBy0fdw/qXeW3tXtadzkas5x3nBwnHti9+Kb/lcte5sqPJOL1MHuFUo+9CpxXVJSi1p6RfqMHRFGjSt6SjQioxS0UYrRJdiS4I9n4WN1SvrOFS3esZxUl4P9T9zKgAAGBi2DYbjNDdxSjCovtLivCXNPvTM8Ac/bSsg/wB2aiq2Dcreb0WvGVOXFqLfXF9T7tH1NxPDJYlh1OVfDpVYRUlGU6c3B69SbXPzT5rtOk86YesUypc02tW6UnH70VvQ/qSObLadBW01U9pvPddNR03G9fji+fDkaxG0q53zTc0/Zq8rKDXHVx1/nUVL5mut7dLjzb5t8336kgscmZnx6+9orV01Lm5JUoLglruy6XomWplfZzhmEwjLEdK9Vdq+ji+6PX4v0QornLGSsVx3SVKO5T/iT4L8K5y8uHei2st5OwrAEpUo79X+JNcV91co/n3khSSXA+k3SAAIoAAAAAAAAAAAAAAADVZowanj+AVaFT449F9klxg/J6FYbFcZqYdi1bD8Q6Mm3KCfVUh0akfFxSf4JFyFM7YcBucGxmniWD6xe9Hfa+GpH3JtfVklo+3j9YuC5gaDJeaLTNeCxq2+imtFVp68YT04r7r5p9aN+QAABSO2aklnOk18VGHynURY+zu3dDLqb+KTf5L9CAbVIu82hUKcOLVKP/tUf/BbeE2iscNp018MUn49fzNcTr9b21o31nOncrWE4uMl2prRnNd7Y3GA43Wt7j3oPRP6270oy0+1DXT7yOmists2W53FnG9sF9JR0VTRc466xn+F8+6T7CYa22yfFY32ASp68aU+H3Z9JfPe9CblGbIcZhZZoVJ8IXEGorskukl5NSj+JdpeY0wABFAAB8lFSi0+s592Z2MZZ8pxktfZuTWv2dToMpXZNR/aM8V6i5R336ya/UuIuoAEUAAAAAAAAAAAAAAAAAAAAADExO2s7+xnSxBKVOa3ZJ9a/R9/UZZ8aUlxApWWF1Nn+KSqYbUdSk/cnTknOK5unWpfHDskuT6lqSzBdquC3fRxHWnL6yTlF+S6a9NO9k1r4dZXC0r0oS8Yoj2J7O8sYlr7Wgot9cJOL/4+RaNxZZhwW/8A3O5ozfYqkdV4x11Rl17+ztqW9cVIRiublJJerZXV7sbw2p+6XNaHYpaTXy3TXQ2OVKFdN1o1Ip+61KGvc2nqvJoDJytbPN20OvfaP9npNQptrhJxSUdPJbz++WqafBaFzh1nGlG3p04RWiVJ8F5P111NtGTfNaEHo81acKtNxqpNNaNPimnwaa7D0AOd865cuclZijK0bVKU/aW9R8dyS0e7J93BPtW6+pl35TzBbZkweNa34S92pDrpzXvRf5p9aafWZWOYPY47hsqOJR3oS9U+qUX1SXaU9cZczNs7xN1sLc6tDl7SEd5qPVGtR+KK48eGnHSUddCovAEJwPaJh9/SXt9xy6/ZzT9act2a8NH4s3sM04O106jj9+E4/NxSIrcg1LzNgiX7xT9TBvs9ZdsY/TVv6ZLXuTaUdfMDcYxeww3Ca1aryp05Tf4U2VxsKsJRw+tXqc5S3U+3T3vmanNudb/PD/YsrUZuE2t9/FJa6pPThCnrzbfV62nlXBKeXsBpUKb1cI9KS+KT4yl5sqNsACKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzMW4w+0uf8+CZlACM32QcsXz1uLaOr602n66msnsqy5r9A69P7tZ/rqTkAV9PZLg0ude586if6H222S4BbVNYuUn9vSS80+D9CwABqsOwh4bRULSajFfDGlCK9IpGzgppdN6+R6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z',
    type: 'lost',
  },
];

const Accueil = () => {
  const [recentItems, setRecentItems] = useState(objetsExemple);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-primary animate-spin" />
              </div>
            ) : recentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentItems.map((item) => (
                  <ItemCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    location={item.location}
                    date={item.date}
                    imageUrl={item.image_url || ''}
                    status={item.type as 'lost' | 'found'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun objet déclaré pour le moment.</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="gap-1">
                  <Link to="/lost-items">
                    Voir tous les objets perdus
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild className="gap-1">
                  <Link to="/found-items">
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
                <Link to="/lost-items">
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

export default Accueil; 