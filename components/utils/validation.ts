import { z } from 'zod';

/**
 * Schema for validating narrative input
 */
export const narrativeSchema = z
  .string()
  .trim()
  .min(10, 'Narrative must be at least 10 characters long')
  .max(10000, 'Narrative cannot exceed 10,000 characters');

/**
 * Schema for validating analysis request
 */
export const analysisRequestSchema = z.object({
  narrative: narrativeSchema,
  previousSessions: z.array(z.string()).optional(),
});

/**
 * Schema for validating environment variables
 */
export const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
});

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize narrative input
 */
export function validateNarrative(narrative: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  try {
    const sanitized = sanitizeInput(narrative);
    narrativeSchema.parse(sanitized);
    return { isValid: true, sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        sanitized: sanitizeInput(narrative),
        error: error.errors[0]?.message || 'Invalid narrative input',
      };
    }
    return {
      isValid: false,
      sanitized: sanitizeInput(narrative),
      error: 'Validation failed',
    };
  }
}

/**
 * Validate environment configuration
 */
export function validateEnv(): { isValid: boolean; error?: string } {
  try {
    envSchema.parse({
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    });
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    return { isValid: false, error: 'Environment validation failed' };
  }
}
