import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any; data: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any; data: any }>;
  updateUserProfile: (data: Record<string, any>) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log("Signing up with email:", email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in`,
          data: {
            email,
            full_name: fullName
          }
        }
      });
      
      console.log("Sign up response:", { data, error });
      
      if (!error) {
        toast({
          title: "Préinscription réussie",
          description: "Un code de vérification va être envoyé à votre email.",
        });
        
        const otpResponse = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/sign-in`,
          }
        });
        
        console.log("OTP resend response:", otpResponse);
        
        if (!otpResponse.error) {
          toast({
            title: "Code envoyé",
            description: "Un code de vérification a été envoyé à votre email.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur d'envoi du code",
            description: otpResponse.error.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message,
        });
      }
      
      return { data, error };
    } catch (e) {
      console.error("Error during signup:", e);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue pendant l'inscription.",
      });
      return { data: null, error: e };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    console.log("Verifying OTP for email:", email, "with token:", token);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });
      
      console.log("Verify OTP response:", { data, error });
      
      if (!error) {
        toast({
          title: "Email vérifié avec succès",
          description: "Votre compte a été activé. Vous êtes maintenant connecté.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: error.message || "Code de vérification invalide ou expiré",
        });
      }

      return { data, error };
    } catch (e) {
      console.error("Error during OTP verification:", e);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue pendant la vérification.",
      });
      return { data: null, error: e };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Signing in with email:", email);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log("Sign in response:", { error });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: error.message,
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
      }
      
      return { error };
    } catch (e) {
      console.error("Error during signin:", e);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue pendant la connexion.",
      });
      return { error: e };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast({
          title: "Email envoyé",
          description: "Vérifiez votre email pour réinitialiser votre mot de passe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message,
        });
      }
      
      return { error };
    } catch (e) {
      console.error("Error during password reset:", e);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue pendant la réinitialisation du mot de passe.",
      });
      return { error: e };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de mise à jour",
          description: error.message,
        });
      }
      
      return { error };
    } catch (e) {
      console.error("Error updating user profile:", e);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur est survenue pendant la mise à jour du profil.",
      });
      return { error: e };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    verifyOtp,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
