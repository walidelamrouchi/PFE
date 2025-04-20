
import { useState, useEffect } from 'react';
import { Search, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70" />
        <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-blue-100 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-indigo-100 opacity-20 blur-3xl" />
      </div>

      <div className="container px-4 mx-auto max-w-6xl">
        <div className={`text-center transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="block">Retrouvez vos objets perdus</span>
            <span className="block text-primary mt-2">à la faculté SMBA Taza</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
            Plateforme dédiée aux étudiants et au personnel pour faciliter la déclaration 
            et la recherche d'objets perdus ou trouvés sur le campus.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Button asChild className="w-full sm:w-auto h-12 px-8 flex items-center gap-2">
              <Link to="/objects">
                <Search className="h-5 w-5" />
                Rechercher un objet
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto h-12 px-8 flex items-center gap-2">
              <Link to="/declare-item">
                <FileSignature className="h-5 w-5" />
                Déclarer un objet
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
