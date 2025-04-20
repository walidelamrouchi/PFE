
import { z } from "zod";

/**
 * Common validation schemas for form inputs
 */

// Basic email validation
export const emailSchema = z
  .string()
  .email({ message: "Adresse email invalide" })
  .min(1, { message: "L'email est requis" });

// Phone number validation - supports international formats
export const phoneSchema = z
  .string()
  .min(1, { message: "Le numéro de téléphone est requis" })
  .refine(
    (phone) => {
      // Basic phone validation that accepts different formats
      // Supports formats like: +33 6 12 34 56 78, 06 12 34 56 78, 0612345678
      const phoneRegex = /^(\+\d{1,3}\s?)?(\d{1,4}[\s.-]?){1,5}\d{1,4}$/;
      return phoneRegex.test(phone);
    },
    { message: "Format de téléphone invalide (ex: +33 6 12 34 56 78)" }
  );

// Text input with minimum length
export const requiredTextSchema = (fieldName: string, minLength = 1) =>
  z.string().min(minLength, { message: `${fieldName} est requis` });

// Optional text input with minimum length if provided
export const optionalTextSchema = (fieldName: string, minLength = 1) =>
  z.string().min(minLength, { message: `${fieldName} doit contenir au moins ${minLength} caractères` }).optional();

// Contact method validation
export const contactMethodSchema = z.object({
  method: z.enum(["email", "phone", "both"], {
    required_error: "La méthode de contact est requise",
  }),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
}).refine((data) => {
  if (data.method === "phone" || data.method === "both") {
    return !!data.phoneNumber;
  }
  return true;
}, {
  message: "Numéro de téléphone requis pour cette méthode de contact",
  path: ["phoneNumber"],
});

// Date validation
export const dateSchema = z
  .string()
  .min(1, { message: "La date est requise" })
  .refine((date) => !isNaN(Date.parse(date)), {
    message: "Format de date invalide",
  });

// Item declaration schema (for lost/found items)
export const itemDeclarationSchema = z.object({
  title: requiredTextSchema("Le titre", 3),
  category: requiredTextSchema("La catégorie"),
  description: requiredTextSchema("La description", 10),
  location: requiredTextSchema("Le lieu"),
  date: dateSchema,
  contactMethod: z.string(),
  phoneNumber: z.string().optional(),
}).refine((data) => {
  if (data.contactMethod === "phone" || data.contactMethod === "both") {
    return !!data.phoneNumber;
  }
  return true;
}, {
  message: "Numéro de téléphone requis pour cette méthode de contact",
  path: ["phoneNumber"],
});

/**
 * Utility functions for form validation
 */

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // For French numbers
  if (digits.startsWith('33') || digits.startsWith('0')) {
    // Handle +33 or 0 prefix for French numbers
    const normalizedDigits = digits.startsWith('0') 
      ? digits 
      : `0${digits.startsWith('33') ? digits.substring(2) : digits}`;
    
    // Format as XX XX XX XX XX
    if (normalizedDigits.length === 10) {
      return normalizedDigits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
  }
  
  // For other international numbers, try basic formatting
  if (digits.length > 6) {
    // Just add a space every 3 digits for readability
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
  }
  
  // Return original if we can't format it
  return phone;
};

// Check if an email is valid
export const isValidEmail = (email: string): boolean => {
  const result = emailSchema.safeParse(email);
  return result.success;
};

// Check if a phone number is valid
export const isValidPhone = (phone: string): boolean => {
  const result = phoneSchema.safeParse(phone);
  return result.success;
};

// Get only numbers from string (useful for phone number processing)
export const getOnlyNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};
