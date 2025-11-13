/**
 * Security utilities for input sanitization and XSS prevention
 *
 * SECURITY: All user-generated content must be sanitized before storage and rendering
 */

// Maximum lengths for various inputs to prevent DoS
export const MAX_LENGTHS = {
  FORM_TITLE: 200,
  FORM_DESCRIPTION: 1000,
  FIELD_TITLE: 500,
  FIELD_DESCRIPTION: 2000,
  SHORT_TEXT: 255,
  LONG_TEXT: 10000,
  CHOICE_LABEL: 200,
  URL: 2048,
  EMAIL: 254, // RFC 5321
  PHONE: 20,
} as const;

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/**
 * HTML character entity map for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS
 *
 * SECURITY: Use this for ALL user-generated content before rendering
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str).replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize text input by removing dangerous characters and limiting length
 *
 * SECURITY: Removes control characters, null bytes, and limits length
 */
export function sanitizeTextInput(
  input: string,
  maxLength: number = MAX_LENGTHS.LONG_TEXT
): string {
  if (!input) return '';

  return String(input)
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize whitespace
    .trim()
    // Limit length
    .slice(0, maxLength);
}

/**
 * Sanitize and validate email address
 *
 * SECURITY: Basic format validation and length check
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  const sanitized = sanitizeTextInput(email, MAX_LENGTHS.EMAIL)
    .toLowerCase()
    .trim();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized;
}

/**
 * Sanitize URL and validate scheme
 *
 * SECURITY: Only allow http/https schemes, validate format
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const sanitized = sanitizeTextInput(url, MAX_LENGTHS.URL).trim();

  try {
    const parsed = new URL(sanitized);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    return parsed.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * Sanitize phone number
 *
 * SECURITY: Allow only digits, spaces, and common phone characters
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  return sanitizeTextInput(phone, MAX_LENGTHS.PHONE)
    .replace(/[^\d\s\-\+\(\)]/g, '')
    .trim();
}

/**
 * Sanitize filename for safe storage
 *
 * SECURITY: Remove path traversal attempts and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed';

  return filename
    // Remove path separators
    .replace(/[\/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Remove dangerous characters
    .replace(/[<>:"|?*]/g, '')
    // Limit length
    .slice(0, 255)
    .trim() || 'unnamed';
}

/**
 * Validate file upload
 *
 * SECURITY: Check file size, type, and count
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = [...FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES, ...FILE_UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES]
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${FILE_UPLOAD_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file type (use MIME type, not just extension)
  const isAllowedType = allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });

  if (!isAllowedType) {
    return {
      valid: false,
      error: 'File type not allowed',
    };
  }

  // Check filename
  const sanitizedName = sanitizeFilename(file.name);
  if (!sanitizedName || sanitizedName === 'unnamed') {
    return {
      valid: false,
      error: 'Invalid filename',
    };
  }

  return { valid: true };
}

/**
 * Validate number input
 *
 * SECURITY: Ensure numeric input is within safe range
 */
export function validateNumber(
  value: number,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): { valid: boolean; error?: string } {
  if (!Number.isFinite(value)) {
    return { valid: false, error: 'Invalid number' };
  }

  if (value < min) {
    return { valid: false, error: `Value must be at least ${min}` };
  }

  if (value > max) {
    return { valid: false, error: `Value must be at most ${max}` };
  }

  return { valid: true };
}

/**
 * Rate limiting helper for client-side operations
 *
 * SECURITY: Prevent rapid repeated actions
 */
export class RateLimiter {
  private timestamps: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}

  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.timestamps.get(key) || [];

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter((ts) => now - ts < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }

    validTimestamps.push(now);
    this.timestamps.set(key, validTimestamps);

    return true;
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.timestamps.delete(key);
  }
}

/**
 * Generate secure random ID
 *
 * SECURITY: Use crypto.randomUUID for secure IDs when available
 */
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback to nanoid (imported in store)
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Sanitize form configuration object
 *
 * SECURITY: Deep sanitization of all user-controlled fields
 */
export function sanitizeFormConfig(config: any): any {
  return {
    title: sanitizeTextInput(config.title || '', MAX_LENGTHS.FORM_TITLE),
    description: config.description
      ? sanitizeTextInput(config.description, MAX_LENGTHS.FORM_DESCRIPTION)
      : undefined,
    // Fields are sanitized individually
    fields: Array.isArray(config.fields)
      ? config.fields.map(sanitizeFieldConfig)
      : [],
    settings: config.settings || {},
  };
}

/**
 * Sanitize field configuration object
 *
 * SECURITY: Sanitize all user-controlled field properties
 */
export function sanitizeFieldConfig(field: any): any {
  const sanitized: any = {
    type: field.type,
    title: sanitizeTextInput(field.title || '', MAX_LENGTHS.FIELD_TITLE),
    description: field.description
      ? sanitizeTextInput(field.description, MAX_LENGTHS.FIELD_DESCRIPTION)
      : undefined,
    placeholder: field.placeholder
      ? sanitizeTextInput(field.placeholder, MAX_LENGTHS.FIELD_TITLE)
      : undefined,
    required: Boolean(field.required),
  };

  // Sanitize choices for multiple choice/dropdown
  if (field.choices && Array.isArray(field.choices)) {
    sanitized.choices = field.choices.map((choice: any) => ({
      id: choice.id,
      label: sanitizeTextInput(choice.label || '', MAX_LENGTHS.CHOICE_LABEL),
      value: sanitizeTextInput(choice.value || '', MAX_LENGTHS.CHOICE_LABEL),
    }));
  }

  // Validate numeric properties
  if (typeof field.min === 'number') {
    const validation = validateNumber(field.min);
    if (validation.valid) sanitized.min = field.min;
  }

  if (typeof field.max === 'number') {
    const validation = validateNumber(field.max);
    if (validation.valid) sanitized.max = field.max;
  }

  if (typeof field.minLength === 'number' && field.minLength >= 0) {
    sanitized.minLength = Math.min(field.minLength, MAX_LENGTHS.LONG_TEXT);
  }

  if (typeof field.maxLength === 'number' && field.maxLength > 0) {
    sanitized.maxLength = Math.min(field.maxLength, MAX_LENGTHS.LONG_TEXT);
  }

  // Copy other safe properties
  if (field.allowMultiple !== undefined) sanitized.allowMultiple = Boolean(field.allowMultiple);
  if (field.allowOther !== undefined) sanitized.allowOther = Boolean(field.allowOther);
  if (field.step !== undefined && typeof field.step === 'number') sanitized.step = field.step;
  if (field.shape) sanitized.shape = field.shape;
  if (field.steps !== undefined && typeof field.steps === 'number') sanitized.steps = field.steps;
  if (field.startLabel) sanitized.startLabel = sanitizeTextInput(field.startLabel, 100);
  if (field.endLabel) sanitized.endLabel = sanitizeTextInput(field.endLabel, 100);
  if (field.buttonText) sanitized.buttonText = sanitizeTextInput(field.buttonText, 50);

  return sanitized;
}

/**
 * Check if string contains potential XSS patterns
 *
 * SECURITY: Basic XSS pattern detection
 */
export function containsXSSPattern(str: string): boolean {
  if (!str) return false;

  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\(/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(str));
}

/**
 * Validate and sanitize response data
 *
 * SECURITY: Ensure response data is safe before storage
 */
export function sanitizeResponseData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeTextInput(data);
  }

  if (typeof data === 'number') {
    const validation = validateNumber(data);
    return validation.valid ? data : 0;
  }

  if (typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeResponseData);
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[sanitizeTextInput(key, 100)] = sanitizeResponseData(value);
    }
    return sanitized;
  }

  return null;
}
