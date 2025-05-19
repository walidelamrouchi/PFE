import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                FINDIT
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Plateforme dédiée aux étudiants et au personnel de la faculté SMBA de Taza pour faciliter 
              la déclaration et la recherche d'objets perdus ou trouvés sur le campus.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Liens rapides</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/objects" className="text-muted-foreground hover:text-primary transition-colors">
                  Objets Déclarés
                </Link>
              </li>
              <li>
                <Link to="/declare-item" className="text-muted-foreground hover:text-primary transition-colors">
                  Déclarer un objet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-muted-foreground">
                Faculté SMBA Taza
              </li>
              <li className="text-muted-foreground">
                oualid.elamrouchi@usmba.ac.ma
              </li>
              <li className="text-muted-foreground">
                +212 633010346
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} ObjetsRetrouvés SMBA Taza. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 