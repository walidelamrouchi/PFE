import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Schéma de validation pour l'inscription
const signupFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Schéma de validation pour la vérification
const verificationFormSchema = z.object({
  otp: z.string().min(6, { message: 'Le code doit contenir 6 chiffres' }),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Formulaire d'inscription
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Formulaire de vérification
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Soumission du formulaire d'inscription
  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // Simuler un délai d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler l'envoi d'un code de vérification
      console.log('Inscription avec:', values);
      setUserEmail(values.email);
      setShowVerification(true);
      
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Soumission du formulaire de vérification
  const onVerificationSubmit = async (values: VerificationFormValues) => {
    setIsLoading(true);
    try {
      // Simuler un délai de vérification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une vérification réussie
      console.log('Vérification avec:', values);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      // Rediriger vers la page de connexion
      window.location.href = '/sign-in';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: "Le code de vérification est invalide.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer le code de vérification
  const resendVerificationCode = async () => {
    setIsLoading(true);
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Code envoyé",
        description: "Un nouveau code de vérification a été envoyé à votre email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer un nouveau code pour le moment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {!showVerification ? (
              // Formulaire d'inscription
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Créer un compte</h1>
                  <p className="text-muted-foreground mt-1">
                    Déjà inscrit ?{' '}
                    <Link to="/sign-in" className="text-primary hover:underline">
                      Se connecter
                    </Link>
                  </p>
                </div>

                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="nom et prenom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="exemple@usmba.ac.ma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              // Formulaire de vérification
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Vérification de l'email</h1>
                  <p className="text-muted-foreground mt-1">
                    Veuillez saisir le code à 6 chiffres envoyé à <span className="font-medium">{userEmail}</span>
                  </p>
                </div>

                <Form {...verificationForm}>
                  <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-6">
                    <FormField
                      control={verificationForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem className="mx-auto">
                          <FormLabel className="text-center block">Code de vérification</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2 items-center">
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                              <Input
                                className="mt-2 w-40 text-center"
                                type="text"
                                placeholder="Ou saisir le code ici"
                                value={field.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value) && value.length <= 6) {
                                    field.onChange(value);
                                  }
                                }}
                                maxLength={6}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Vérification en cours...' : 'Vérifier mon email'}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Vous n'avez pas reçu de code ?{' '}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="px-0" 
                          onClick={resendVerificationCode}
                          disabled={isLoading}
                        >
                          Renvoyer le code
                        </Button>
                      </p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="px-0 mt-1" 
                        onClick={() => setShowVerification(false)}
                      >
                        Retour à l'inscription
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
