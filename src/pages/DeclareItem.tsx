import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Schéma de validation
const formSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  type: z.enum(["lost", "found"]),
  location: z.string().min(3, "Veuillez indiquer un lieu"),
  date: z.date(),
  imageUrl: z.string().optional(),
  email: z.string().email("Format d'email invalide").optional(),
  authQuestion: z.string().min(5, "La question doit contenir au moins 5 caractères"),
  authAnswer: z.string().min(10, "La réponse doit contenir au moins 10 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

// Liste des catégories disponibles
const categories = [
  'Téléphone', 'Ordinateur', 'Vêtement', 'Bijou', 'Clés',
  'Portefeuille', 'Sac', 'Document', 'Lunettes', 'Animal', 'Autre'
];

// Email enregistré (simulé pour le frontend)
const registeredEmail = "utilisateur@example.com";

const DeclareItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [emailChoice, setEmailChoice] = useState<"registered" | "custom">("registered");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "lost",
      location: "",
      date: new Date(),
      imageUrl: "",
      email: registeredEmail,
      authQuestion: "",
      authAnswer: "",
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChoiceChange = (value: "registered" | "custom") => {
    setEmailChoice(value);
    if (value === "registered") {
      form.setValue('email', registeredEmail);
    } else {
      form.setValue('email', '');
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stocker les données du formulaire
      setFormData(values);
      
      // Afficher les données dans la console
      console.log('Données du formulaire:', values);
      
      // Réinitialiser le formulaire
      form.reset();
      setImagePreview(null);
      setEmailChoice("registered");
      
      alert('Formulaire soumis avec succès !');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue lors de la soumission du formulaire.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
    <div className="flex-grow container max-w-4xl mx-auto px-4 sm:px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">Déclarer un objet perdu ou trouvé</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de déclaration</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lost">Objet perdu</SelectItem>
                      <SelectItem value="found">Objet trouvé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lieu */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("type") === 'lost'
                      ? 'Lieu de perte (approximatif)'
                      : 'Lieu de découverte'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ex: Faculté des Sciences, Bibliothèque, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {form.watch("type") === 'lost'
                      ? 'Date de perte (approximative)'
                      : 'Date de découverte'}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Catégorie */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Ex: iPhone 12 noir"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Décrivez l'objet avec le plus de détails possible"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            {/* Image */}
            <div className="space-y-2">
              <FormLabel>Image de l'objet (optionnel)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`border-2 border-dashed rounded-lg ${
                    imagePreview ? 'border-primary' : 'border-border'
                  } p-4 flex flex-col items-center justify-center h-40 relative overflow-hidden ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isLoading && document.getElementById('image-upload')?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Upload className="h-10 w-10 mb-2" />
                      <span className="text-sm">Cliquez pour ajouter une image</span>
                      <span className="text-xs">(recommandé)</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Une image claire aidera à l'identification de l'objet.
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Prenez la photo avec un bon éclairage</li>
                    <li>Montrez l'objet en entier</li>
                    <li>Taille maximale : 5MB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Question d'authentification - uniquement pour les objets perdus */}
            {form.watch("type") === "lost" && (
              <div className="space-y-4 border-t pt-6 mt-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Sécurisez votre objet</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une question d'authentification qui permettra de prouver votre bonne foi. 
                    Donnez une information que vous êtes le seul à connaître sur votre objet.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="authQuestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choisissez la question qui ne laissera aucun doute</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Ex: Quelle est la marque exacte de l'objet ?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Répondez à votre question avec détails et précision</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isLoading}
                          placeholder="Ex: C'est un iPhone 12 Pro Max de 256GB en couleur Graphite, avec une coque en cuir noir Apple..."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
             {/* Email de contact */}
            <div className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Email de contact</FormLabel>
                <RadioGroup 
                  defaultValue="registered" 
                  className="flex flex-col space-y-2"
                  onValueChange={(value) => handleEmailChoiceChange(value as "registered" | "custom")}
                  value={emailChoice}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="registered" id="registered" disabled={isLoading} />
                    <FormLabel htmlFor="registered" className="cursor-pointer font-normal">
                      Utiliser mon email d'inscription ({registeredEmail})
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" disabled={isLoading} />
                    <FormLabel htmlFor="custom" className="cursor-pointer font-normal">
                      Utiliser un autre email
                    </FormLabel>
                  </div>
                </RadioGroup>
              </div>
              
              {emailChoice === "custom" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email personnalisé</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="votre@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Bouton de soumission */}
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                'Déclarer l\'objet'
              )}
            </Button>
          </form>
        </Form>

        {/* Affichage des données soumises */}
        {formData && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Données soumises :</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </div>

  );
};

export default DeclareItem;
