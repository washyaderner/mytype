// Field Types
export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'phone'
  | 'url'
  | 'date'
  | 'multiple_choice'
  | 'dropdown'
  | 'yes_no'
  | 'rating'
  | 'opinion_scale'
  | 'file_upload'
  | 'statement';

// Validation Types
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Conditional Logic Types
export type LogicOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';

export interface LogicCondition {
  id: string;
  fieldId: string;
  operator: LogicOperator;
  value: any;
}

export interface LogicAction {
  type: 'jump_to' | 'skip_to' | 'end_form';
  targetFieldId?: string;
}

export interface ConditionalLogic {
  id: string;
  conditions: LogicCondition[];
  conditionMatch: 'all' | 'any'; // AND or OR
  action: LogicAction;
}

// Choice Types (for multiple choice, dropdown, etc.)
export interface Choice {
  id: string;
  label: string;
  value: string;
}

// Field Configuration
export interface FieldConfig {
  id: string;
  type: FieldType;
  title: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  validations?: ValidationRule[];

  // Type-specific properties
  choices?: Choice[]; // for multiple_choice, dropdown
  allowMultiple?: boolean; // for multiple_choice
  allowOther?: boolean; // for multiple_choice, dropdown

  min?: number; // for number, rating, opinion_scale
  max?: number; // for number, rating, opinion_scale
  step?: number; // for number, opinion_scale

  minLength?: number; // for text fields
  maxLength?: number; // for text fields

  startLabel?: string; // for opinion_scale
  endLabel?: string; // for opinion_scale

  shape?: 'star' | 'heart' | 'thumbs' | 'numbers'; // for rating
  steps?: number; // for rating

  maxFileSize?: number; // for file_upload (in bytes)
  allowedFileTypes?: string[]; // for file_upload
  maxFiles?: number; // for file_upload

  // Button text (for statement)
  buttonText?: string;

  // Conditional Logic
  logic?: ConditionalLogic[];
}

// Form Configuration
export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
}

// Form Settings
export interface FormSettings {
  // Appearance
  theme?: 'light' | 'dark' | 'custom';
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;

  // Behavior
  showProgressBar?: boolean;
  progressBarType?: 'percentage' | 'proportion'; // e.g., "50%" or "5/10"
  allowBackNavigation?: boolean;
  randomizeFieldOrder?: boolean;
  oneQuestionAtATime?: boolean;

  // Submission
  submitButtonText?: string;
  showSubmitButton?: boolean;
  redirectUrl?: string;
  showThankYouMessage?: boolean;
  thankYouMessage?: string;

  // Notifications
  notificationEmail?: string;
  sendConfirmationEmail?: boolean;
  confirmationEmailSubject?: string;
  confirmationEmailBody?: string;
}

// Form Response Types
export interface FieldResponse {
  fieldId: string;
  fieldType: FieldType;
  value: any;
  timestamp: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: FieldResponse[];
  startedAt: string;
  completedAt?: string;
  isComplete: boolean;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

// Store Types
export interface FormStore {
  forms: FormConfig[];
  responses: FormResponse[];
  currentForm: FormConfig | null;

  // Form CRUD operations
  createForm: (form: Omit<FormConfig, 'id' | 'createdAt' | 'updatedAt'>) => FormConfig;
  updateForm: (id: string, updates: Partial<FormConfig>) => void;
  deleteForm: (id: string) => void;
  getForm: (id: string) => FormConfig | undefined;
  duplicateForm: (id: string) => FormConfig | undefined;

  // Field operations
  addField: (formId: string, field: Omit<FieldConfig, 'id'>) => void;
  updateField: (formId: string, fieldId: string, updates: Partial<FieldConfig>) => void;
  deleteField: (formId: string, fieldId: string) => void;
  reorderFields: (formId: string, fieldIds: string[]) => void;

  // Response operations
  saveResponse: (response: Omit<FormResponse, 'id'>) => void;
  getResponses: (formId: string) => FormResponse[];
  deleteResponse: (responseId: string) => void;

  // Current form operations
  setCurrentForm: (formId: string | null) => void;
}

// Builder UI Types
export interface DragItem {
  id: string;
  type: FieldType;
  index: number;
}

export interface DropResult {
  draggedId: string;
  targetId?: string;
  position: 'before' | 'after';
}
