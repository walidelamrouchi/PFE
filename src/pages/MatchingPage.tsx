import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
}

interface ScoreDetails {
  category: number;
  location: number;
  date: number;
  description: number;
  image: number;
}

interface MatchDetail {
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
  score_details: ScoreDetails;
  score_image: number;
  labels_communs: string[];
  isUserInvolved: boolean;
}

export default function MatchingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    const fetchMatch = async () => {
      if (!user || !id) return;

      try {
        const response = await axios.get(`http://localhost/PFE/api/declarations/match.php?ids=${id}`, {
          headers: {
            'X-User-ID': user.id
          }
        });

        if (response.data.success) {
          setMatch(response.data.match);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du match",
          variant: "destructive"
        });
        navigate('/matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [user, id, navigate, toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/50">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir les détails du match</p>
            <Button onClick={() => navigate('/sign-in')}>Se connecter</Button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/50">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <div className="text-center py-12">Chargement...</div>
        </main>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/50">
        <Navbar />
        <main className="flex-grow container mx-auto py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Match non trouvé</h2>
            <Button onClick={() => navigate('/matches')}>Retour aux matches</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-900">Détails du match</h2>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              Retour aux matches
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                Score de correspondance : {match.score}%
              </div>
              {match.isUserInvolved && (
                <div className="text-sm text-muted-foreground mb-4">
                  Vous êtes impliqué dans ce match
                </div>
              )}
              
              {/* Détails du score */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="font-semibold">Catégorie</div>
                  <div className="text-emerald-700">{match.score_details.category}%</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="font-semibold">Lieu</div>
                  <div className="text-emerald-700">{match.score_details.location}%</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="font-semibold">Date</div>
                  <div className="text-emerald-700">{match.score_details.date}%</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="font-semibold">Description</div>
                  <div className="text-emerald-700">{match.score_details.description}%</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="font-semibold">Image</div>
                  <div className="text-emerald-700">{match.score_details.image}%</div>
                </div>
              </div>

              {/* Labels communs */}
              {match.labels_communs.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">Éléments communs détectés :</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {match.labels_communs.map((label, index) => (
                      <span
                        key={index}
                        className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carte Perdu */}
            <Card>
              <CardHeader>
                <div className="text-xs text-muted-foreground mb-1">Ref. {match.lost.id}</div>
                <CardTitle className="text-lg font-bold">{match.lost.title}</CardTitle>
                <CardDescription>
                  {match.lost.date_incident} <br />
                  {match.lost.location} <br />
                  <span className="text-sm text-muted-foreground">
                    Par {match.lost.user.username}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {match.lost.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`http://localhost/PFE/${match.lost.image_url}`}
                      alt={match.lost.title}
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-muted-foreground">{match.lost.category_name}</div>
                  <div className="text-sm">{match.lost.description}</div>
                  <div className="pt-4 border-t">
                    <div className="text-sm font-semibold">Contact :</div>
                    <div className="text-sm text-muted-foreground">
                      {match.lost.user.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte Trouvé */}
            <Card className="bg-cyan-50">
              <CardHeader>
                <div className="text-xs text-muted-foreground mb-1">Ref. {match.found.id}</div>
                <CardTitle className="text-lg font-bold">{match.found.title}</CardTitle>
                <CardDescription>
                  {match.found.date_incident} <br />
                  {match.found.location} <br />
                  <span className="text-sm text-muted-foreground">
                    Par {match.found.user.username}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {match.found.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`http://localhost/PFE/${match.found.image_url}`}
                      alt={match.found.title}
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-muted-foreground">{match.found.category_name}</div>
                  <div className="text-sm">{match.found.description}</div>
                  <div className="pt-4 border-t">
                    <div className="text-sm font-semibold">Contact :</div>
                    <div className="text-sm text-muted-foreground">
                      {match.found.user.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 