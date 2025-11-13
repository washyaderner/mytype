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
- [x] Feature 3: Form Renderer (One-Question-at-a-Time)
- [x] Feature 4: Animations & Transitions (Motion)
- [x] Feature 5: Export/Import/Share
- [x] Feature 6: Webhook Integration
- [ ] Feature 7: Conditional Logic Implementation
- [ ] Feature 8: Response Analytics Dashboard
- [ ] Feature 9: Advanced Field Types

## Feature 3: Form Renderer & Animations ✅

**Status**: Complete

Beautiful one-question-at-a-time form experience with smooth Motion animations:

### Form Renderer Components (`components/form-renderer/`)

#### Field Components (`fields/`)
Complete implementation for all 14 field types:
- **TextField**: Handles short_text, email, phone, url, number with proper input types
- **TextareaField**: Multi-line text with character counter
- **DateField**: Native date picker
- **MultipleChoiceField**: Radio/checkbox style with keyboard shortcuts
- **DropdownField**: Select dropdown
- **YesNoField**: Large emoji buttons (👍/👎)
- **RatingField**: Star/heart/thumbs/number ratings
- **OpinionScaleField**: Numeric scale with min/max labels
- **FileUploadField**: Drag-and-drop file upload
- **StatementField**: Information screens with continue button

#### DynamicForm Component
One-question-at-a-time experience:
- **Navigation**: Forward/backward with validation
- **Progress Bar**: Animated progress indicator
- **Keyboard Support**: Enter to continue, handles multiline inputs
- **Auto-focus**: Inputs automatically focused
- **Validation**: Real-time field validation
- **Auto-save**: Progress saved to localStorage
- **Error Handling**: Graceful error display
- **Response Sanitization**: All data sanitized before submission

#### Thank You Screen
- Success animation with checkmark
- Custom thank you message
- Auto-redirect support (3 second delay)
- Smooth fade-in animations

### Motion Animations

#### Question Transitions
- **Slide animations**: Questions slide in/out from sides
- **Direction-aware**: Different animations for forward/backward
- **Spring physics**: Natural, smooth motion (stiffness: 300, damping: 30)
- **Opacity fade**: Smooth fade during transitions
- **AnimatePresence**: No overlapping questions

#### Progress Bar
- **Animated width**: Smooth progress updates (0.3s duration)
- **Gradient fill**: Purple to blue gradient
- **Fixed position**: Always visible at top

#### Interaction Animations
- **Button hovers**: Scale up to 1.05
- **Button taps**: Scale down to 0.95
- **Field focus**: Ring animations on focus
- **Error shake**: Shake animation for validation errors

#### Staggered Reveals
- **Question number**: Fades in first (delay: 0.2s)
- **Question title**: Slides up (delay: 0.3s)
- **Description**: Fades in (delay: 0.4s)
- **Input field**: Slides up (delay: 0.5s)
- **Navigation**: Fades in (delay: 0.6s)
- **Hint text**: Fades in (delay: 0.7s)

### User Experience Features
- **Large typography**: 4xl-5xl headings for readability
- **Prominent inputs**: Large, easy-to-click inputs
- **Gradient backgrounds**: Beautiful purple-blue-pink gradients
- **Responsive design**: Mobile-first, works on all devices
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Empty states**: Helpful messages for empty forms
- **Loading states**: Spinner for form submission

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

## Feature 5: Export/Import/Share ✅

**Status**: Complete

Form portability and sharing functionality integrated into builder:

### Export Forms
- **exportFormToJSON()** utility (`utils/export-import.ts`)
- Sanitizes form data before export (XSS prevention)
- Downloads as formatted JSON with date stamp
- Filename format: `form-title-2024-01-15.json`
- Export button in builder top bar

### Import Forms
- **importFormFromJSON()** utility with validation
- Validates required fields (title, fields array)
- Sanitizes all imported data
- Strips IDs for regeneration (prevents conflicts)
- Handles errors gracefully with user feedback
- Import button triggers file picker (.json only)

### Share Forms
- **generateFormURL()** creates shareable links
- **copyToClipboard()** with cross-browser support
- Fallback for older browsers (document.execCommand)
- Share Link button copies URL to clipboard
- Format: `{origin}/forms/{formId}`

### Security Features
- All exports pass through `sanitizeFormConfig()`
- Import validation prevents malformed data
- MIME type filtering (`.json`, `application/json`)
- No sensitive data in error messages
- File input reset after import

**Testing:**
1. Click Export → JSON downloads
2. Click Import → Upload JSON → Form loads
3. Click Share Link → URL copied to clipboard

## Feature 6: Webhook Integration ✅

**Status**: Complete

Production-ready webhook system for Make.com, n8n, Zapier, and custom endpoints:

### Core Functionality (`utils/webhook.ts`)
- **sendWebhook()** - Sends form responses with exponential backoff retry
- **buildWebhookPayload()** - Creates standardized payload format
- **isValidWebhookUrl()** - SSRF prevention (blocks localhost/private IPs)
- **testWebhook()** - Endpoint verification with test payload
- 10-second timeout on all requests
- Automatic retry logic for failures

### Webhook Configuration UI
Located in Form Settings → Webhooks section:
- **Enable/Disable** - Toggle webhook notifications
- **Webhook URL** - Enter endpoint (Make.com, n8n, Zapier, custom)
- **Test Button** - Verify endpoint is reachable
- **Advanced Settings** (collapsible):
  - Custom headers for authentication (X-API-Key, Authorization, etc.)
  - Retry count (0-5, default: 3)
  - Retry delay (1-10s, default: 2s)
  - Retry logic explanation
  - Payload format documentation

### Retry Logic
Automatic exponential backoff for failed webhooks:
- **Attempt 1**: Immediate
- **Attempt 2**: 2s delay (configurable)
- **Attempt 3**: 4s delay (2x)
- **Attempt 4**: 8s delay (4x)
- **4xx errors**: No retry (client error - bad URL, auth failure)
- **5xx errors**: Full retry (server error - temporary)
- **Network errors**: Full retry
- **Timeouts**: Full retry (10s timeout)

### Payload Format
Compatible with Make.com, n8n, Zapier:
```json
{
  "event": "form_response",
  "form_id": "abc123",
  "form_title": "Contact Form",
  "response_id": "xyz789",
  "submitted_at": "2024-01-15T10:30:00Z",
  "form_response": {
    "fields": [
      {
        "field_id": "field1",
        "field_type": "short_text",
        "field_title": "Your Name",
        "value": "John Doe"
      },
      {
        "field_id": "field2",
        "field_type": "email",
        "field_title": "Email Address",
        "value": "john@example.com"
      }
    ]
  }
}
```

### Security Features
- **SSRF Prevention**: Blocks localhost and private IP ranges
- **URL Validation**: Only http/https protocols allowed
- **Custom Headers**: Support for API key authentication
- **Timeout Protection**: 10s limit prevents hanging
- **Non-blocking**: Webhook failures don't prevent form submission
- **Error Logging**: Console logs for debugging (no sensitive data)

### Integration Flow
1. User submits form → Response saved to localStorage
2. If webhookEnabled → sendWebhook() called asynchronously
3. Webhook attempts with retry logic
4. Success/failure logged to console
5. User sees thank you page regardless of webhook status

**Testing:**
1. Go to `/builder` → Settings → Webhooks
2. Enable webhooks
3. Enter webhook URL (try https://webhook.site for testing)
4. Optional: Add custom headers for authentication
5. Click "Test Webhook" → Verify success message
6. Submit a form → Check webhook endpoint for data

**Use Cases:**
- **Make.com**: Connect to CRM, email, Slack, etc.
- **n8n**: Custom automation workflows
- **Zapier**: 3000+ app integrations
- **Custom**: Your own backend/database

## Current Status

**Features 1-6 Complete** - Full-featured Typeform replacement!

The application now has:
- Complete type system and state management (Feature 1)
- Full drag-and-drop form builder with security (Feature 2)
- One-question-at-a-time form renderer (Feature 3)
- Smooth Motion animations throughout (Feature 4)
- Export/import/share functionality (Feature 5)
- Production-ready webhook integration (Feature 6)
- 14 field types fully implemented
- Response storage to localStorage
- Complete end-to-end flow

**You can now:**
1. Build forms with drag-and-drop at `/builder`
2. Configure all field properties
3. Export forms as JSON for backup
4. Import forms for duplication/migration
5. Share form URLs `/forms/[formId]` via clipboard
6. **Send responses to Make.com, n8n, Zapier, or custom webhooks**
7. **Configure retry logic and authentication headers**
8. **Test webhooks before going live**
9. Fill out forms with beautiful animations
10. View responses in localStorage

**This is now a fully viable Typeform alternative** with the core features needed for production use.

Next steps: Conditional logic, response analytics dashboard, advanced field types.
