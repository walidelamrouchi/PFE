
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const signupFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Le nom complet doit contenir au moins 3 caractères' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const verificationFormSchema = z.object({
  otp: z.string().min(6, { message: 'Le code doit contenir 6 chiffres' }),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

const SignUp = () => {
  const { signUp, verifyOtp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [step, setStep] = useState<'signup' | 'verification' | 'success'>('signup');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSignupSubmit = async (values: SignupFormValues) => {
    console.log("Submitting signup form with values:", values);
    setIsLoading(true);
    
    try {
      setVerificationEmail(values.email);
      setStoredPassword(values.password);
      
      const { error } = await signUp(values.email, values.password, values.fullName);
      console.log("Signup response:", { error });
      
      if (!error) {
        setStep('verification');
        toast({
          title: "Code de vérification envoyé",
          description: "Veuillez vérifier votre email pour le code de vérification à 6 chiffres.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        });
      }
    } catch (error: any) {
      console.error("Error in signup form submission:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerificationSubmit = async (values: VerificationFormValues) => {
    console.log("Submitting verification form with values:", values, "for email:", verificationEmail);
    setIsLoading(true);
    
    try {
      const { error } = await verifyOtp(verificationEmail, values.otp);
      console.log("Verification response:", { error });
      
      if (!error) {
        setStep('success');
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous serez redirigé vers la page d'accueil.",
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: error.message || "Code invalide. Veuillez vérifier le code et réessayer.",
        });
      }
    } catch (error: any) {
      console.error("Error in verification form submission:", error);
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: error.message || "Une erreur est survenue lors de la vérification. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      verificationForm.setValue('otp', value);
    }
  };

  const resendVerificationCode = async () => {
    if (!verificationEmail) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: verificationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in`,
        }
      });
      
      if (!error) {
        toast({
          title: "Code envoyé",
          description: "Un nouveau code de vérification a été envoyé à votre email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'envoi",
          description: error.message || "Impossible d'envoyer un nouveau code pour le moment.",
        });
      }
    } catch (error: any) {
      console.error("Error resending verification code:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi du code. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center pt-16 pb-8">
          <div className="w-full max-w-md mx-auto p-8 glass-panel text-center">
            <h1 className="text-2xl font-bold mb-4">Inscription réussie</h1>
            <p className="mb-6">
              Votre email a été vérifié avec succès. Vous êtes maintenant connecté.
            </p>
            <Button onClick={() => navigate('/')}>
              Aller à l'accueil
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (step === 'verification') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center pt-16 pb-8">
          <div className="w-full max-w-md mx-auto p-8 glass-panel">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Vérification de l'email</h1>
              <p className="text-muted-foreground mt-1">
                Veuillez saisir le code à 6 chiffres envoyé à <span className="font-medium">{verificationEmail}</span>
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
                            value={field.value || ''}
                            onChange={handleOtpInput}
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
                    onClick={() => setStep('signup')}
                  >
                    Retour à l'inscription
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center pt-16 pb-8">
        <div className="w-full max-w-md mx-auto p-8 glass-panel">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Inscription</h1>
            <p className="text-muted-foreground mt-1">
              Créez un compte pour accéder à toutes les fonctionnalités
            </p>
          </div>
          
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
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
                      <Input placeholder="votre@email.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Déjà un compte ?{' '}
                  <Link to="/sign-in" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignUp;
