import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  User,
  Edit,
  Save,
  Trash2,
  Bell,
  BellOff,
  MessageSquare
} from "lucide-react";

const Profile = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à votre profil.",
      });
      navigate('/sign-in');
      return;
    }

    if (user) {
      setEmail(user.email || '');
      setUsername(user.email?.split('@')[0] || '');
      
      // Extract additional user metadata if available
      const metadata = user.user_metadata;
      if (metadata) {
        setFullName(metadata.full_name || '');
      }
    }
  }, [user, authLoading, navigate, toast]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Notifications désactivées" : "Notifications activées",
      description: notificationsEnabled 
        ? "Vous ne recevrez plus de notifications." 
        : "Vous recevrez désormais des notifications.",
    });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // First delete user data from any tables
      // This is just a placeholder - in a real app you would
      // delete user's data from your application tables
      const { error: dataError } = await supabase
        .from('items')
        .delete()
        .eq('user_id', user?.id);
      
      if (dataError) {
        console.error("Error deleting user data:", dataError);
      }

      // Then sign out the user
      await signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès. Vous allez être redirigé.",
      });
      
      // Redirect to homepage
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error.message || "Une erreur est survenue lors de la suppression du compte.",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-md p-8 space-y-4 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-muted animate-pulse" />
              <div className="h-8 w-3/4 mx-auto rounded bg-muted animate-pulse" />
              <div className="h-6 w-1/2 mx-auto rounded bg-muted animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            {!isEditing ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2"
              >
                Annuler
              </Button>
            )}
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Vous pouvez modifier certaines informations de votre profil." 
                  : "Consultez vos informations personnelles."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
                  <AvatarFallback>
                    {fullName 
                      ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{fullName || username}</h3>
                  <p className="text-muted-foreground">{email}</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre adresse email ne peut pas être modifiée.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    disabled={true}
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre nom ne peut pas être modifié après l'inscription.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>
                Récapitulatif de votre activité sur la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Objets perdus</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Objets trouvés</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/my-items')}
              >
                Voir mes objets
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>
                Gérez les paramètres de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notificationsEnabled ? (
                      <Bell className="h-5 w-5 text-primary" />
                    ) : (
                      <BellOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications pour les mises à jour importantes.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={notificationsEnabled ? "default" : "outline"} 
                    size="sm"
                    onClick={toggleNotifications}
                  >
                    {notificationsEnabled ? "Activées" : "Désactivées"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Gérez vos préférences de messagerie.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
                    Configurer
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Supprimer le compte</p>
                      <p className="text-sm text-muted-foreground">
                        Supprimez définitivement votre compte et toutes vos données.
                      </p>
                    </div>
                  </div>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre
                          compte et toutes les données associées de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isLoading ? "Suppression..." : "Supprimer définitivement"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
