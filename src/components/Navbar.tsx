import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                FINDIT
              </span>
            </Link>
          </div>
          
          <nav className={`hidden md:flex space-x-8` } >
            <Link to="/" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-white">
              <Home size={16} />
              Accueil
            </Link>
            
            <Link to="/objects" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-white">
              <Search size={16} />
              Recherche Objets
            </Link>
            
            <Link to="/declare-item" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-white">
              <FileSignature size={16} />
              Déclarer
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/sign-in">Se connecter</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/sign-up">S'inscrire</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex md:hidden">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link 
              to="/objects" 
              className="flex items-center gap-1 block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={16} />
              Recherche Objets
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-1 block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={16} />
              Accueil
            </Link>
            <Link 
              to="/declare-item" 
              className="flex items-center gap-1 block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileSignature size={16} />
              Déclarer
            </Link>
            <div className="flex flex-col gap-2 mt-4">
              <Button 
                variant="outline"
                className="w-full"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/sign-in">Se connecter</Link>
              </Button>
              <Button 
                className="w-full" 
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/sign-up">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 