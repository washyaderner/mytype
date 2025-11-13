# MyType - Typeform Clone MVP

A beautiful, one-question-at-a-time form builder application built with Next.js 14, TypeScript, and Tailwind CSS.

## Project Overview

MyType is a form builder application that allows users to design beautiful forms with:
- Drag-and-drop interface
- One question at a time experience
- Smooth animations
- Conditional logic
- Multiple field types
- LocalStorage persistence (MVP)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Animations**: Motion (Framer Motion)
- **Drag & Drop**: @dnd-kit
- **ID Generation**: nanoid

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
/app
  /builder          # Form builder interface
    /components     # Builder-specific components
    page.tsx        # Builder test page
  /forms            # Form listing and rendering
    /[formId]       # Individual form renderer
      page.tsx
    page.tsx
  layout.tsx        # Root layout
  page.tsx          # Landing page
  globals.css       # Global styles

/components
  /form-builder     # Form builder components
    /fields         # Builder field components
  /form-renderer    # Form renderer components
    /fields         # Renderer field components
  /ui               # Shared UI components

/lib
  store.ts          # Zustand store with localStorage

/types
  index.ts          # TypeScript type definitions

/utils
  form-helpers.ts   # Form utility functions
  schema-generator.ts # Zod schema generation

/public             # Static assets
```

## Feature 1: Schema & Store Setup ✅

**Status**: Complete

This feature establishes the foundation of the application with:

### TypeScript Interfaces (`/types/index.ts`)
- `FieldType`: 14 different field types (short_text, email, multiple_choice, etc.)
- `FieldConfig`: Complete field configuration with type-specific properties
- `FormConfig`: Form structure with fields and settings
- `FormSettings`: Appearance, behavior, and submission settings
- `FormResponse`: Response storage structure
- `ValidationRule`: Validation configuration
- `ConditionalLogic`: Logic for field branching

### Zustand Store (`/lib/store.ts`)
- LocalStorage persistence using Zustand middleware
- Form CRUD operations: create, update, delete, duplicate
- Field operations: add, update, delete, reorder
- Response management: save, retrieve, delete
- All IDs generated with nanoid for uniqueness

### Utility Functions (`/utils/form-helpers.ts`)
- `getDefaultFieldConfig()`: Default configurations for each field type
- `evaluateLogicCondition()`: Evaluate conditional logic rules
- `getNextField()`: Determine next field based on logic
- `validateFieldValue()`: Client-side field validation
- `calculateProgress()`: Form completion progress
- `formatProgress()`: Format progress display
- `getFieldTypeLabel()`: Human-readable field type names
- `formatFileSize()`: Format bytes to human-readable sizes
- `shuffleArray()`: Randomize field order

### Zod Schema Generator (`/utils/schema-generator.ts`)
- `generateFieldSchema()`: Create Zod schema for individual fields
- `generateFormSchema()`: Create complete form schema
- `validateFormData()`: Validate entire form submission
- `validateField()`: Validate single field value
- Dynamic schema generation based on field configuration

## Supported Field Types

1. **Text Fields**: short_text, long_text
2. **Specialized Inputs**: email, phone, url, date, number
3. **Choice Fields**: multiple_choice, dropdown, yes_no
4. **Rating Fields**: rating, opinion_scale
5. **Media**: file_upload
6. **Content**: statement

## Testing the Implementation

Visit `/builder` to access the full form builder interface:
- Drag and drop fields from the palette
- Configure field properties in real-time
- Reorder fields with drag-and-drop
- Customize form settings
- Create multiple forms
- All data persists to localStorage

## Development Roadmap

- [x] Feature 1: Schema & Store Setup
- [x] Feature 2: Form Builder UI
- [ ] Feature 3: Field Components
- [ ] Feature 4: Form Renderer
- [ ] Feature 5: Conditional Logic
- [ ] Feature 6: Animations & Transitions
- [ ] Feature 7: Response Management
- [ ] Feature 8: Export & Analytics

## Feature 2: Form Builder UI ✅

**Status**: Complete

Comprehensive drag-and-drop form builder with security-first architecture:

### Security Infrastructure
- **Input Sanitization** (`utils/security.ts`): XSS prevention for all user inputs
- **Security Headers** (`middleware.ts`): OWASP-compliant headers (CSP, HSTS, X-Frame-Options, etc.)
- **Error Boundaries** (`components/ErrorBoundary.tsx`): Graceful error handling without exposing sensitive data
- **Rate Limiting**: Client-side rate limiting for rapid actions
- **File Upload Validation**: MIME type checking, size limits, filename sanitization
- **Length Limits**: Enforced maximum lengths for all text inputs

### UI Component Library (`components/ui/`)
- **Button**: Multiple variants (primary, secondary, danger, ghost) with loading states
- **Input**: Sanitized text input with error states
- **Textarea**: Multi-line input with automatic sanitization
- **Select**: Dropdown with consistent styling
- **Card**: Flexible container components

### Form Builder Components

#### Field Palette (`components/form-builder/FieldPalette.tsx`)
- Organized field categories (Text, Numbers, Choices, Ratings, Media)
- Drag-and-drop field sources
- Visual field type indicators

#### Form Canvas (`components/form-builder/FormCanvas.tsx`)
- Sortable field list with @dnd-kit
- Live field previews
- Drag-to-reorder functionality
- Empty state guidance
- Field selection and deletion

#### Field Property Editor (`components/form-builder/FieldPropertyEditor.tsx`)
- Type-specific property panels
- Real-time updates
- Choice management for multiple choice/dropdown
- Validation settings
- All inputs sanitized

#### Form Settings Panel (`components/form-builder/FormSettingsPanel.tsx`)
- Appearance customization (theme, colors)
- Behavior settings (progress bar, navigation)
- Submission configuration
- Email notifications setup

#### Builder Page (`app/builder/page.tsx`)
- Three-panel layout (palette, canvas, editor)
- Tabs for Fields and Settings
- Form switching and creation
- Auto-save simulation
- Preview mode
- Wrapped in Suspense for Next.js 15 compatibility

### Security Features Implemented
1. **XSS Prevention**: All user content escaped before rendering
2. **Input Validation**: Length limits, type checking, pattern matching
3. **CSRF Protection**: Ready for token implementation
4. **Secure Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
5. **Error Handling**: No stack traces or system info exposed
6. **File Upload Security**: Type validation, size limits, sanitized filenames

## Key Features

### LocalStorage Persistence
All form data is automatically persisted to localStorage using Zustand middleware. Data survives page refreshes and browser sessions.

### Type Safety
Strict TypeScript mode ensures type safety throughout the application. All components, utilities, and store operations are fully typed.

### Security-First Architecture
- Input sanitization on all user inputs
- XSS prevention through escaping
- Secure HTTP headers via middleware
- Error boundaries prevent information leakage
- File upload validation
- Rate limiting for client-side actions

### Validation
Dual validation approach:
1. Zod schemas for runtime validation
2. Field-level validation rules
3. Custom validation support
4. Client-side sanitization

### Conditional Logic
Support for complex form logic (ready for implementation):
- Jump to specific fields
- Skip to sections
- End form early
- Multiple conditions (AND/OR)
- Various operators (equals, contains, greater_than, etc.)

## Browser Support

- Modern browsers with ES2017+ support
- LocalStorage required

## License

MIT

## Current Status

**Features 1 & 2 Complete** - Full form builder interface with security infrastructure.

The application now has:
- Complete type system and state management
- Full drag-and-drop form builder
- Security utilities and middleware
- Reusable UI component library
- Field property editing
- Form settings management

Next step: Implement Feature 3 (Advanced Field Components) and Feature 4 (Form Renderer) for the public-facing form experience.
