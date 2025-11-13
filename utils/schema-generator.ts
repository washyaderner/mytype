import { z } from 'zod';
import type { FieldConfig, FormConfig } from '@/types';

/**
 * Generate Zod schema for a single field
 */
export function generateFieldSchema(field: FieldConfig): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'short_text':
    case 'long_text':
      schema = z.string();
      if (field.minLength) {
        schema = (schema as z.ZodString).min(
          field.minLength,
          `Minimum length is ${field.minLength} characters`
        );
      }
      if (field.maxLength) {
        schema = (schema as z.ZodString).max(
          field.maxLength,
          `Maximum length is ${field.maxLength} characters`
        );
      }
      break;

    case 'email':
      schema = z.string().email('Please enter a valid email address');
      break;

    case 'url':
      schema = z.string().url('Please enter a valid URL');
      break;

    case 'phone':
      schema = z
        .string()
        .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number');
      break;

    case 'number':
      schema = z.coerce.number();
      if (field.min !== undefined) {
        schema = (schema as z.ZodNumber).min(
          field.min,
          `Value must be at least ${field.min}`
        );
      }
      if (field.max !== undefined) {
        schema = (schema as z.ZodNumber).max(
          field.max,
          `Value must be at most ${field.max}`
        );
      }
      break;

    case 'date':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date');
      break;

    case 'multiple_choice':
      if (field.allowMultiple) {
        schema = z.array(z.string()).min(1, 'Please select at least one option');
      } else {
        schema = z.string();
      }
      break;

    case 'dropdown':
      schema = z.string();
      if (field.choices && field.choices.length > 0) {
        const validValues = field.choices.map((c) => c.value);
        if (field.allowOther) {
          schema = z.string();
        } else {
          schema = z.enum(validValues as [string, ...string[]]);
        }
      }
      break;

    case 'yes_no':
      schema = z.boolean();
      break;

    case 'rating':
      schema = z.number().min(1).max(field.steps || 5);
      break;

    case 'opinion_scale':
      schema = z
        .number()
        .min(field.min || 1)
        .max(field.max || 10);
      break;

    case 'file_upload':
      if (field.maxFiles && field.maxFiles > 1) {
        schema = z.array(z.instanceof(File)).max(
          field.maxFiles,
          `Maximum ${field.maxFiles} files allowed`
        );
      } else {
        schema = z.instanceof(File);
      }
      break;

    case 'statement':
      schema = z.boolean().optional();
      break;

    default:
      schema = z.any();
  }

  // Apply custom validations
  if (field.validations) {
    for (const validation of field.validations) {
      if (validation.type === 'pattern' && schema instanceof z.ZodString) {
        schema = schema.regex(new RegExp(validation.value), validation.message);
      }
    }
  }

  // Make optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Generate Zod schema for an entire form
 */
export function generateFormSchema(form: FormConfig): z.ZodObject<any> {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const field of form.fields) {
    schemaShape[field.id] = generateFieldSchema(field);
  }

  return z.object(schemaShape);
}

/**
 * Validate form data against schema
 */
export function validateFormData(
  form: FormConfig,
  data: Record<string, any>
): { success: boolean; errors?: Record<string, string> } {
  const schema = generateFormSchema(form);

  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      const zodError = error as any;
      for (const issue of zodError.issues || zodError.errors || []) {
        const fieldPath = issue.path.join('.');
        errors[fieldPath] = issue.message;
      }
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

/**
 * Validate a single field value
 */
export function validateField(
  field: FieldConfig,
  value: any
): { success: boolean; error?: string } {
  const schema = generateFieldSchema(field);

  try {
    schema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      const issues = zodError.issues || zodError.errors || [];
      return { success: false, error: issues[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Validation failed' };
  }
}
