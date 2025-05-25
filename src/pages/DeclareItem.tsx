import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import declarationService, { Category, DeclarationData, ObjetData } from '@/services/declaration.service';

export default function DeclareItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [fetching, setFetching] = useState(!!id);

  const [objetData, setObjetData] = useState<ObjetData>({
    title: '',
    description: '',
    category_id: 0,
    image_url: ''
  });

  const [declarationData, setDeclarationData] = useState<Omit<DeclarationData, 'objet'>>({
    type: 'lost',
    location: '',
    date_incident: '',
    contact_email: '',
    auth_question: '',
    auth_answer: ''
  });
  type DeclarationState = Omit<DeclarationData, 'objet'> & {
    returned?: number; // Ajouter la propriété 'returned' comme optionnelle
  };
  const isReturned = (declarationData as DeclarationState).returned === 1;

  useEffect(() => {
    loadCategories();
    if (id) {
      setFetching(true);
      declarationService.getDeclarationDetail(Number(id))
        .then((data) => {
          if (data) {
            setObjetData({
              title: data.title,
              description: data.description,
              category_id: data.category_id,
              image_url: data.image_url || ''
            });
            setDeclarationData({
              type: data.type,
              location: data.location,
              date_incident: data.date_incident,
              contact_email: data.contact_email,
              auth_question: data.auth_question || '',
              auth_answer: data.auth_answer || ''
            });
            setType(data.type);
            setImagePreview(data.image_url || '');
          }
        })
        .finally(() => setFetching(false));
    }
    // eslint-disable-next-line
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await declarationService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = objetData.image_url;
      if (imageFile) {
        imageUrl = await declarationService.uploadImage(imageFile);
      }
      const data: DeclarationData = {
        objet: {
          ...objetData,
        image_url: imageUrl
        },
        ...declarationData,
        type
      };
      if (id) {
        await declarationService.updateDeclaration(Number(id), data);
        toast({ title: 'Succès', description: 'Déclaration mise à jour.' });
      } else {
      await declarationService.createDeclaration(data);
        toast({ title: 'Succès', description: 'Votre déclaration a été enregistrée avec succès' });
      }
      navigate('/my-items');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReturned = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await declarationService.markAsReturned(Number(id));
      toast({ title: 'Succès', description: 'Objet marqué comme rendu.' });
      navigate('/my-items');
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible de marquer comme rendu.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Voulez-vous vraiment supprimer cette déclaration ?')) return;
    setLoading(true);
    try {
      await declarationService.deleteDeclaration(Number(id));
      toast({ title: 'Succès', description: 'Déclaration supprimée.' });
      navigate('/my-items');
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible de supprimer.", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="container mx-auto py-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? 'Modifier la déclaration' : 'Déclarer un objet'}</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour {id ? 'modifier' : 'déclarer'} un objet perdu ou trouvé
          </CardDescription>
          {isReturned && (
            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                ✅ Objet rendu
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={type} onValueChange={(value) => setType(value as 'lost' | 'found')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lost">Objet Perdu</TabsTrigger>
              <TabsTrigger value="found">Objet Trouvé</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={objetData.title}
                    onChange={(e) => setObjetData({ ...objetData, title: e.target.value })}
                    required
                    disabled={isReturned}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={objetData.category_id.toString()}
                    onValueChange={(value) => setObjetData({ ...objetData, category_id: parseInt(value) })}
                    disabled={isReturned}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={objetData.description}
                    onChange={(e) => setObjetData({ ...objetData, description: e.target.value })}
                    required
                    disabled={isReturned}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={declarationData.location}
                    onChange={(e) => setDeclarationData({ ...declarationData, location: e.target.value })}
                    required
                    disabled={isReturned}
                  />
                </div>
                <div>
                  <Label htmlFor="date_incident">Date</Label>
                  <Input
                    id="date_incident"
                    type="date"
                    value={declarationData.date_incident}
                    onChange={(e) => setDeclarationData({ ...declarationData, date_incident: e.target.value })}
                    required
                    disabled={isReturned}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email de contact</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={declarationData.contact_email}
                    onChange={(e) => setDeclarationData({ ...declarationData, contact_email: e.target.value })}
                    required
                    disabled={isReturned}
                  />
                </div>
                {type === 'lost' && (
                  <>
                    <div>
                      <Label htmlFor="auth_question">Question de sécurité</Label>
                      <Input
                        id="auth_question"
                        value={declarationData.auth_question}
                        onChange={(e) => setDeclarationData({ ...declarationData, auth_question: e.target.value })}
                        required
                        placeholder="Ex: Quelle est la marque de votre téléphone ?"
                        disabled={isReturned}
                      />
                    </div>
                    <div>
                      <Label htmlFor="auth_answer">Réponse de sécurité</Label>
                      <Input
                        id="auth_answer"
                        value={declarationData.auth_answer}
                        onChange={(e) => setDeclarationData({ ...declarationData, auth_answer: e.target.value })}
                        required
                        placeholder="Ex: Samsung"
                        disabled={isReturned}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="image">Photo</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isReturned}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="max-w-xs rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || isReturned}>
                {loading ? (id ? 'Mise à jour...' : 'Enregistrement...') : (id ? 'Mettre à jour' : 'Enregistrer')}
              </Button>
              {id && (
                <div className="flex gap-4 mt-4">
                  <Button type="button" variant="secondary" className="w-full" onClick={handleMarkAsReturned} disabled={loading || isReturned}>
                    Objet rendu ?
                  </Button>
                  <Button type="button" variant="destructive" className="w-full" onClick={handleDelete} disabled={loading || isReturned}>
                    Supprimer l'objet
                  </Button>
                </div>
              )}
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
