import type {
  FieldConfig,
  FieldType,
  FormConfig,
  LogicCondition,
  FieldResponse,
  Choice,
} from '@/types';

/**
 * Get default field configuration for a given field type
 */
export function getDefaultFieldConfig(type: FieldType): Omit<FieldConfig, 'id'> {
  const baseConfig = {
    type,
    title: '',
    description: '',
    required: false,
  };

  switch (type) {
    case 'short_text':
      return {
        ...baseConfig,
        title: 'Short Text Question',
        placeholder: 'Type your answer here...',
        maxLength: 255,
      };

    case 'long_text':
      return {
        ...baseConfig,
        title: 'Long Text Question',
        placeholder: 'Type your answer here...',
        maxLength: 5000,
      };

    case 'email':
      return {
        ...baseConfig,
        title: 'Email Question',
        placeholder: 'name@example.com',
      };

    case 'number':
      return {
        ...baseConfig,
        title: 'Number Question',
        placeholder: 'Enter a number...',
      };

    case 'phone':
      return {
        ...baseConfig,
        title: 'Phone Number Question',
        placeholder: '+1 (555) 000-0000',
      };

    case 'url':
      return {
        ...baseConfig,
        title: 'URL Question',
        placeholder: 'https://example.com',
      };

    case 'date':
      return {
        ...baseConfig,
        title: 'Date Question',
      };

    case 'multiple_choice':
      return {
        ...baseConfig,
        title: 'Multiple Choice Question',
        choices: [
          { id: '1', label: 'Option 1', value: 'option_1' },
          { id: '2', label: 'Option 2', value: 'option_2' },
        ],
        allowMultiple: false,
        allowOther: false,
      };

    case 'dropdown':
      return {
        ...baseConfig,
        title: 'Dropdown Question',
        choices: [
          { id: '1', label: 'Option 1', value: 'option_1' },
          { id: '2', label: 'Option 2', value: 'option_2' },
        ],
        allowOther: false,
      };

    case 'yes_no':
      return {
        ...baseConfig,
        title: 'Yes/No Question',
      };

    case 'rating':
      return {
        ...baseConfig,
        title: 'Rating Question',
        steps: 5,
        shape: 'star',
      };

    case 'opinion_scale':
      return {
        ...baseConfig,
        title: 'Opinion Scale Question',
        min: 1,
        max: 10,
        step: 1,
        startLabel: 'Not likely',
        endLabel: 'Very likely',
      };

    case 'file_upload':
      return {
        ...baseConfig,
        title: 'File Upload Question',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 1,
        allowedFileTypes: ['image/*', 'application/pdf'],
      };

    case 'statement':
      return {
        ...baseConfig,
        title: 'Statement',
        description: 'This is a statement or information screen',
        buttonText: 'Continue',
      };

    default:
      return baseConfig;
  }
}

/**
 * Evaluate conditional logic for a field
 */
export function evaluateLogicCondition(
  condition: LogicCondition,
  responses: FieldResponse[]
): boolean {
  const response = responses.find((r) => r.fieldId === condition.fieldId);

  if (!response) {
    return condition.operator === 'is_empty';
  }

  const { value } = response;
  const { operator, value: conditionValue } = condition;

  switch (operator) {
    case 'equals':
      return value === conditionValue;

    case 'not_equals':
      return value !== conditionValue;

    case 'contains':
      return String(value).toLowerCase().includes(String(conditionValue).toLowerCase());

    case 'greater_than':
      return Number(value) > Number(conditionValue);

    case 'less_than':
      return Number(value) < Number(conditionValue);

    case 'is_empty':
      return !value || value === '' || (Array.isArray(value) && value.length === 0);

    case 'is_not_empty':
      return !!value && value !== '' && (!Array.isArray(value) || value.length > 0);

    default:
      return false;
  }
}

/**
 * Get the next field based on conditional logic
 */
export function getNextField(
  currentField: FieldConfig,
  responses: FieldResponse[],
  allFields: FieldConfig[]
): FieldConfig | null {
  if (!currentField.logic || currentField.logic.length === 0) {
    // No logic, return next field in sequence
    const currentIndex = allFields.findIndex((f) => f.id === currentField.id);
    return allFields[currentIndex + 1] || null;
  }

  // Evaluate logic rules
  for (const logic of currentField.logic) {
    const conditionsMet =
      logic.conditionMatch === 'all'
        ? logic.conditions.every((cond) => evaluateLogicCondition(cond, responses))
        : logic.conditions.some((cond) => evaluateLogicCondition(cond, responses));

    if (conditionsMet) {
      const { action } = logic;

      if (action.type === 'end_form') {
        return null;
      }

      if (action.type === 'jump_to' && action.targetFieldId) {
        return allFields.find((f) => f.id === action.targetFieldId) || null;
      }

      if (action.type === 'skip_to' && action.targetFieldId) {
        return allFields.find((f) => f.id === action.targetFieldId) || null;
      }
    }
  }

  // No logic matched, return next field in sequence
  const currentIndex = allFields.findIndex((f) => f.id === currentField.id);
  return allFields[currentIndex + 1] || null;
}

/**
 * Calculate form progress
 */
export function calculateProgress(
  currentFieldIndex: number,
  totalFields: number
): number {
  if (totalFields === 0) return 0;
  return Math.round(((currentFieldIndex + 1) / totalFields) * 100);
}

/**
 * Format progress for display
 */
export function formatProgress(
  currentFieldIndex: number,
  totalFields: number,
  type: 'percentage' | 'proportion' = 'percentage'
): string {
  if (type === 'percentage') {
    return `${calculateProgress(currentFieldIndex, totalFields)}%`;
  }
  return `${currentFieldIndex + 1}/${totalFields}`;
}

/**
 * Validate field value
 */
export function validateFieldValue(
  field: FieldConfig,
  value: any
): { isValid: boolean; error?: string } {
  // Check required
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return { isValid: false, error: 'This field is required' };
    }
    if (Array.isArray(value) && value.length === 0) {
      return { isValid: false, error: 'This field is required' };
    }
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      break;

    case 'url':
      if (value) {
        try {
          new URL(value);
        } catch {
          return { isValid: false, error: 'Please enter a valid URL' };
        }
      }
      break;

    case 'phone':
      if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
      }
      break;

    case 'number':
      if (value !== '' && isNaN(Number(value))) {
        return { isValid: false, error: 'Please enter a valid number' };
      }
      if (field.min !== undefined && Number(value) < field.min) {
        return { isValid: false, error: `Value must be at least ${field.min}` };
      }
      if (field.max !== undefined && Number(value) > field.max) {
        return { isValid: false, error: `Value must be at most ${field.max}` };
      }
      break;

    case 'short_text':
    case 'long_text':
      if (field.minLength && value && value.length < field.minLength) {
        return { isValid: false, error: `Minimum length is ${field.minLength} characters` };
      }
      if (field.maxLength && value && value.length > field.maxLength) {
        return { isValid: false, error: `Maximum length is ${field.maxLength} characters` };
      }
      break;
  }

  // Custom validations
  if (field.validations) {
    for (const validation of field.validations) {
      if (validation.type === 'pattern' && value) {
        const regex = new RegExp(validation.value);
        if (!regex.test(value)) {
          return { isValid: false, error: validation.message };
        }
      }
    }
  }

  return { isValid: true };
}

/**
 * Get field type display name
 */
export function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    short_text: 'Short Text',
    long_text: 'Long Text',
    email: 'Email',
    number: 'Number',
    phone: 'Phone',
    url: 'URL',
    date: 'Date',
    multiple_choice: 'Multiple Choice',
    dropdown: 'Dropdown',
    yes_no: 'Yes/No',
    rating: 'Rating',
    opinion_scale: 'Opinion Scale',
    file_upload: 'File Upload',
    statement: 'Statement',
  };
  return labels[type] || type;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Shuffle array (for randomizing field order)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
