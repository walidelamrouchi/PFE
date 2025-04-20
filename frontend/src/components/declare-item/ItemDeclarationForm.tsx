import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

// Import form section components
import DeclarationTypeField from './form-sections/DeclarationTypeField';
import TitleDescriptionFields from './form-sections/TitleDescriptionFields';
import CategoryField from './form-sections/CategoryField';
import LocationDateFields from './form-sections/LocationDateFields';
import ContactFields from './form-sections/ContactFields';
import ImageSection from './form-sections/ImageSection';
import SubmitButton from './form-sections/SubmitButton';

const formSchema = z.object({
  type: z.enum(['lost', 'found']),
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  location: z.string().min(3, 'La localisation doit contenir au moins 3 caractères'),
  date: z.date({
    required_error: 'Veuillez sélectionner une date',
  }),
  email: z.string().email('Veuillez fournir un email valide').optional(),
});

interface ItemDeclarationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
  isEditing?: boolean;
}

const ItemDeclarationForm = ({ 
  onSubmit, 
  isLoading = false, 
  initialData = null,
  isEditing = false,
}: ItemDeclarationFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'lost',
      title: '',
      description: '',
      category: '',
      location: '',
      date: new Date(),
      email: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        type: initialData.type,
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        location: initialData.location,
        date: new Date(initialData.date),
        email: initialData.email || '',
      });
      
      setImageUrl(initialData.image_url);
    }
  }, [initialData, form]);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      imageUrl: imageUrl,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <DeclarationTypeField 
            control={form.control} 
            disabled={isLoading} 
          />

          <TitleDescriptionFields 
            control={form.control} 
            disabled={isLoading} 
          />

          <CategoryField 
            control={form.control} 
            disabled={isLoading} 
          />

          <LocationDateFields 
            control={form.control} 
            watch={form.watch} 
            disabled={isLoading} 
          />

          <ContactFields 
            control={form.control} 
            disabled={isLoading} 
          />

          <ImageSection 
            onImageUpload={handleImageUpload} 
            initialImageUrl={imageUrl} 
            disabled={isLoading} 
          />
        </div>

        <SubmitButton isLoading={isLoading} isEditing={isEditing} />
      </form>
    </Form>
  );
};

export default ItemDeclarationForm;
