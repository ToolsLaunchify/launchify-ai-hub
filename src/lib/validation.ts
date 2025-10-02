import { z } from 'zod';

// Email validation schema
const emailSchema = z.string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

// Phone validation schema
const phoneSchema = z.string()
  .trim()
  .max(20, { message: "Phone number must be less than 20 characters" })
  .regex(/^[0-9\s\-\+\(\)]+$/, { message: "Invalid phone number format" })
  .optional()
  .nullable();

// Lead form validation schema
export const leadFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-\.\']+$/, { message: "Name can only contain letters, spaces, hyphens, periods, and apostrophes" }),
  
  email: emailSchema,
  
  phone: phoneSchema,
});

// Purchase form validation schema
export const purchaseFormSchema = z.object({
  customer_name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s\-\.\']+$/, { message: "Name can only contain letters, spaces, hyphens, periods, and apostrophes" }),
  
  customer_email: emailSchema,
  
  customer_phone: phoneSchema,
  
  customer_company: z.string()
    .trim()
    .max(200, { message: "Company name must be less than 200 characters" })
    .optional()
    .nullable(),
});

// Sanitize text input - remove potentially harmful characters
export const sanitizeTextInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Validate and sanitize lead data
export const validateLeadData = (data: {
  name: string;
  email: string;
  phone?: string | null;
}) => {
  const validated = leadFormSchema.parse(data);
  
  return {
    name: sanitizeTextInput(validated.name),
    email: validated.email.toLowerCase(),
    phone: validated.phone ? sanitizeTextInput(validated.phone) : null,
  };
};

// Validate and sanitize purchase data
export const validatePurchaseData = (data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  customer_company?: string | null;
}) => {
  const validated = purchaseFormSchema.parse(data);
  
  return {
    customer_name: sanitizeTextInput(validated.customer_name),
    customer_email: validated.customer_email.toLowerCase(),
    customer_phone: validated.customer_phone ? sanitizeTextInput(validated.customer_phone) : null,
    customer_company: validated.customer_company ? sanitizeTextInput(validated.customer_company) : null,
  };
};
