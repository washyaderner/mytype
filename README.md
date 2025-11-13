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

Visit `/builder` to test the store functionality:
- Create test forms with multiple fields
- Update form titles and descriptions
- Duplicate existing forms
- Delete forms
- All data persists to localStorage

## Development Roadmap

- [x] Feature 1: Schema & Store Setup
- [ ] Feature 2: Form Builder UI
- [ ] Feature 3: Field Components
- [ ] Feature 4: Form Renderer
- [ ] Feature 5: Conditional Logic
- [ ] Feature 6: Animations & Transitions
- [ ] Feature 7: Response Management
- [ ] Feature 8: Export & Analytics

## Key Features

### LocalStorage Persistence
All form data is automatically persisted to localStorage using Zustand middleware. Data survives page refreshes and browser sessions.

### Type Safety
Strict TypeScript mode ensures type safety throughout the application. All components, utilities, and store operations are fully typed.

### Validation
Dual validation approach:
1. Zod schemas for runtime validation
2. Field-level validation rules
3. Custom validation support

### Conditional Logic
Support for complex form logic:
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

**Feature 1 Complete** - The foundation is ready for building the form builder UI and field components.

Next step: Implement Feature 2 (Form Builder UI) with drag-and-drop field management.
