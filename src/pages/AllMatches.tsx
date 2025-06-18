import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
}

interface MatchItem {
  found: {
    id: number;
    title: string;
    description: string;
    location: string;
    date_incident: string;
    image_url: string;
    category_name: string;
    user: User;
  };
  lost: {
    id: number;
    title: string;
    description: string;
    location: string;
    date_incident: string;
    image_url: string;
    category_name: string;
    user: User;
  };
  score: number;
}

export default function AllMatches() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Charger l'utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
        setUser(null);
      }
    }
  }, []);

  // Charger les matches de l'utilisateur
  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      try {
        const response = await axios.get('http://localhost/PFE/api/declarations/list_matches.php', {
          headers: {
            'X-User-ID': user.id
          }
        });

        if (response.data.success) {
          setMatches(response.data.matches);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos matchs",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, toast]);

  // Rediriger vers la page de connexion si non connecté
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/50">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir vos matchs</p>
            <Button onClick={() => navigate('/sign-in')}>Se connecter</Button>
          </div>
        </main>
      </div>
    );
  }

  // Afficher la liste des matches
  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-6 text-emerald-900">Mes matchs</h2>
        
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Vous n'avez aucun match en cours</div>
        ) : (
          <div className="flex flex-col gap-8">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-stretch gap-4 border-2 border-emerald-500">
                {/* Carte Perdu */}
                <Card className="flex-1 flex flex-col items-center">
                  <CardHeader>
                    <div className="text-xs text-muted-foreground mb-1">Ref. {match.lost.id}</div>
                    <CardTitle className="text-lg font-bold">{match.lost.title}</CardTitle>
                    <CardDescription>
                      {match.lost.date_incident} <br />
                      {match.lost.location} <br />
                      <span className="text-sm text-muted-foreground">Par {match.lost.user.username}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {match.lost.image_url && (
                      <img src={`http://localhost/PFE/${match.lost.image_url}`} alt={match.lost.title} className="w-24 h-24 object-cover rounded mb-2" />
                    )}
                    <div className="text-muted-foreground text-sm mb-2">{match.lost.category_name}</div>
                    <div className="text-center text-sm mb-2">{match.lost.description}</div>
                    <span className="rounded-full border border-red-400 text-red-500 px-2 text-xs font-bold">P</span>
                  </CardContent>
                </Card>

                {/* Carte Trouvé */}
                <Card className="flex-1 flex flex-col items-center bg-cyan-50">
                  <CardHeader>
                    <div className="text-xs text-muted-foreground mb-1">Ref. {match.found.id}</div>
                    <CardTitle className="text-lg font-bold">{match.found.title}</CardTitle>
                    <CardDescription>
                      {match.found.date_incident} <br />
                      {match.found.location} <br />
                      <span className="text-sm text-muted-foreground">Par {match.found.user.username}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {match.found.image_url && (
                      <img src={`http://localhost/PFE/${match.found.image_url}`} alt={match.found.title} className="w-24 h-24 object-cover rounded mb-2" />
                    )}
                    <div className="text-muted-foreground text-sm mb-2">{match.found.category_name}</div>
                    <div className="text-center text-sm mb-2">{match.found.description}</div>
                    <span className="rounded-full border border-teal-400 text-teal-500 px-2 text-xs font-bold">T</span>
                  </CardContent>
                </Card>

                {/* Action */}
                <div className="flex flex-col justify-end items-center md:w-48 w-full mt-4 md:mt-0">
                  <div className="mb-2 text-center font-semibold text-emerald-700">Score : {match.score}%</div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/matching/${match.found.id}_${match.lost.id}`)}
                  >
                    Voir le match
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 