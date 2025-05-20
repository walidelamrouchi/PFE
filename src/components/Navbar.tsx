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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const menuItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Rechercher objets', href: '/search' },
    { label: 'Déclarer', href: '/declare-item' },
  ];

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
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Link
                      to="/search"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search size={20} />
                      Rechercher
                    </Link>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                        Se connecter
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/sign-up" onClick={() => setIsOpen(false)}>
                        S'inscrire
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              FINDIT
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8  " >
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1 hover:text-primary transition-colors`}
              >
                {item.label}
              </Link>
            ))}
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
              variant="outline"
              size="sm"
              asChild
              className={isScrolled ? 'text-gray-900' : 'text-gray-600'}
            >
              <Link to="/sign-in">Connexion</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className="flex items-center gap-1 block py-2 text-gray-900 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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