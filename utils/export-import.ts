import type { FormConfig } from '@/types';
import { sanitizeFormConfig } from '@/utils/security';

/**
 * Export form to JSON file
 *
 * SECURITY: Sanitizes form data before export
 */
export function exportFormToJSON(form: FormConfig): void {
  try {
    // SECURITY: Sanitize before export
    const sanitized = sanitizeFormConfig(form);

    const dataStr = JSON.stringify(sanitized, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;

    // Format: form-title-2024-01-15.json
    const date = new Date().toISOString().split('T')[0];
    const filename = `${form.title.toLowerCase().replace(/\s+/g, '-')}-${date}.json`;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export form');
  }
}

/**
 * Import form from JSON file
 *
 * SECURITY: Validates and sanitizes imported data
 */
export async function importFormFromJSON(file: File): Promise<FormConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate required fields
        if (!data.title || !data.fields || !Array.isArray(data.fields)) {
          throw new Error('Invalid form schema');
        }

        // SECURITY: Sanitize imported data
        const sanitized = sanitizeFormConfig(data);

        // Remove IDs so new ones are generated
        const imported: any = {
          ...sanitized,
          createdAt: undefined,
          updatedAt: undefined,
        };

        // Remove field IDs too
        imported.fields = imported.fields.map((field: any) => ({
          ...field,
          id: undefined,
        }));

        resolve(imported as FormConfig);
      } catch (error) {
        console.error('Import error:', error);
        reject(new Error('Invalid JSON file or corrupted form data'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Copy text to clipboard
 *
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (error) {
    console.error('Clipboard error:', error);
    return false;
  }
}

/**
 * Generate shareable form URL
 */
export function generateFormURL(formId: string): string {
  if (typeof window === 'undefined') {
    return `https://mytype.app/forms/${formId}`;
  }

  const baseURL = window.location.origin;
  return `${baseURL}/forms/${formId}`;
}
