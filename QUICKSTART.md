# MyType - Quick Start Guide

## 🚀 Getting Started in Cursor

### 1. Clone the Repository

```bash
# Clone from GitHub (replace with your actual repo URL)
git clone https://github.com/yourusername/mytype.git
cd mytype
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📖 User Guide

### Creating Your First Form

1. **Navigate to Builder**
   - Click "Create Your First Form" from the homepage
   - Or go directly to `/builder`

2. **Add Fields**
   - Drag field types from the left palette onto the canvas
   - Available fields:
     - Short Text, Long Text
     - Email, Phone, URL
     - Number, Date
     - Multiple Choice, Dropdown, Yes/No
     - Rating, Opinion Scale
     - File Upload, Statement

3. **Configure Fields**
   - Click any field to open the property editor on the right
   - Set title, description, placeholder
   - Mark as required
   - Add validation rules
   - Configure field-specific options (choices, min/max, etc.)

4. **Reorder Fields**
   - Drag and drop fields to reorder them

5. **Form Settings**
   - Click the "Settings" tab
   - Configure appearance (theme, colors, fonts)
   - Set behavior (progress bar, back navigation)
   - Configure submission (button text, thank you message, redirect)
   - Set up email notifications
   - **Configure webhooks** (Make.com, n8n, Zapier)

### Sharing Your Form

1. **Get Share Link**
   - Click "Share Link" button in the builder
   - URL is copied to clipboard: `/forms/{formId}`

2. **Preview Form**
   - Click "Preview" to test in new tab
   - Experience the form as respondents will see it

3. **Export Form**
   - Click "Export" to download as JSON
   - Use for backup or sharing form templates

### Managing Forms

1. **Forms List** (`/forms`)
   - View all your forms
   - See response counts
   - Edit, view, or delete forms
   - Access responses for each form

2. **Form Actions**
   - **Edit**: Open in builder
   - **Duplicate**: Create a copy
   - **Export**: Download as JSON
   - **Import**: Upload JSON file
   - **Delete**: Remove form (cannot be undone)

### Viewing Responses

1. **Access Responses** (`/responses/{formId}`)
   - Click "Responses" button on any form
   - View all submitted responses in order
   - See timestamp for each submission

2. **Export to CSV**
   - Click "Export CSV" to download all responses
   - Includes all fields and timestamps
   - Perfect for analysis in Excel/Google Sheets

3. **Delete Responses**
   - Click trash icon on any response
   - Confirm deletion (cannot be undone)

---

## 🔗 Webhook Integration

### Setting Up Webhooks

1. **Enable Webhooks**
   - Go to Builder → Settings → Webhooks
   - Toggle "Enable webhook notifications"

2. **Configure Webhook URL**
   - Enter your endpoint URL:
     - **Make.com**: `https://hooks.make.com/...`
     - **n8n**: `https://your-n8n.com/webhook/...`
     - **Zapier**: `https://hooks.zapier.com/hooks/catch/...`
     - **Custom**: Your own backend endpoint

3. **Test Webhook**
   - Click "Test Webhook" button
   - Verify connection is successful

4. **Advanced Settings** (Optional)
   - **Custom Headers**: Add authentication
     - Example: `X-API-Key: your-secret-key`
   - **Retry Count**: Set number of retries (0-5)
   - **Retry Delay**: Set initial delay in ms (1000-10000)

### Webhook Payload Format

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

### Retry Logic

- **Attempt 1**: Immediate
- **Attempt 2**: 2s delay (configurable)
- **Attempt 3**: 4s delay (exponential backoff)
- **Attempt 4**: 8s delay
- **4xx errors**: No retry (client error)
- **5xx errors**: Full retry (server error)
- **Timeouts**: Full retry (10s timeout)

---

## 🧪 Testing Checklist

### Form Builder Testing

- [ ] Create new form
- [ ] Add fields of each type (14 types)
- [ ] Configure field properties
- [ ] Reorder fields with drag-and-drop
- [ ] Delete fields
- [ ] Switch between Forms tab and Settings tab
- [ ] Update form settings (appearance, behavior, submission)
- [ ] Configure webhooks
- [ ] Test webhook connection
- [ ] Preview form in new tab
- [ ] Export form as JSON
- [ ] Import form from JSON
- [ ] Duplicate form
- [ ] Share form link
- [ ] Switch between multiple forms

### Form Renderer Testing

- [ ] Open shared form URL
- [ ] Navigate through questions (forward)
- [ ] Navigate backwards
- [ ] Test validation (required fields)
- [ ] Test each field type input
- [ ] Test keyboard navigation (Enter key)
- [ ] Complete form submission
- [ ] See thank you page
- [ ] Test redirect (if configured)
- [ ] Verify progress bar updates
- [ ] Test on mobile device

### Response Management Testing

- [ ] View responses for a form
- [ ] See all submitted data
- [ ] Export responses to CSV
- [ ] Open CSV in Excel/Sheets
- [ ] Delete a response
- [ ] Verify response count updates

### Webhook Testing

- [ ] Enable webhooks
- [ ] Add webhook URL (use https://webhook.site for testing)
- [ ] Click "Test Webhook"
- [ ] Submit a form
- [ ] Verify webhook received data
- [ ] Test with authentication headers
- [ ] Test retry logic (use failing endpoint)
- [ ] Verify webhook doesn't block submission

### Edge Cases

- [ ] Empty form (no fields)
- [ ] Form with only statement fields
- [ ] Form with 20+ fields
- [ ] Long text values (1000+ characters)
- [ ] File upload (if implemented)
- [ ] Multiple choice with 10+ options
- [ ] Delete form with responses
- [ ] Browser refresh during form filling
- [ ] Multiple forms with same name

---

## 🐛 Troubleshooting

### Build Errors

**Issue**: TypeScript errors during build
```bash
npm run build
```
**Solution**: Check console for specific errors, ensure all dependencies are installed

**Issue**: Port 3000 already in use
```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### LocalStorage Issues

**Issue**: Forms not persisting
- Check browser console for errors
- Verify localStorage is enabled in browser
- Try clearing localStorage: `localStorage.clear()`

**Issue**: Can't see forms list
- Check if forms exist: `console.log(localStorage.getItem('mytype-storage'))`
- Create a new form to initialize

### Webhook Issues

**Issue**: Webhook test fails
- Verify URL is valid (http/https only)
- Check URL is not localhost/private IP
- Test URL in browser/Postman first
- Check custom headers are correct

**Issue**: Webhook not sending
- Check webhook is enabled in settings
- Verify form submission completes
- Check browser console for webhook logs
- Test with webhook.site first

---

## 📁 Project Structure

```
/app
  /builder          # Form builder page
  /forms            # Form list & public forms
    /[formId]       # Individual form renderer
  /responses        # Response viewer
    /[formId]       # Responses for specific form
  layout.tsx        # Root layout
  page.tsx          # Landing page

/components
  /form-builder     # Builder components
  /form-renderer    # Renderer components
  /ui               # Shared UI components

/lib
  store.ts          # Zustand store with localStorage

/types
  index.ts          # TypeScript definitions

/utils
  export-import.ts  # Export/import utilities
  form-helpers.ts   # Form utility functions
  schema-generator.ts # Zod schema generation
  security.ts       # Security utilities
  webhook.ts        # Webhook functionality
```

---

## 🔐 Security Features

- **XSS Prevention**: All user inputs sanitized
- **CSRF Protection**: Ready for token implementation
- **Secure Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Input Validation**: Length limits, type checking
- **File Upload Security**: MIME type validation, size limits
- **SSRF Prevention**: Webhook URL validation
- **No Stack Traces**: Error boundaries prevent info leakage

---

## 🚀 Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

No environment variables needed for MVP! Everything runs client-side with localStorage.

For production with a backend, you might add:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

---

## 📝 Next Steps (Future Enhancements)

1. **Conditional Logic** - Show/hide fields based on answers
2. **Response Analytics** - Charts, completion rates, drop-off analysis
3. **Database Integration** - Move from localStorage to PostgreSQL/MongoDB
4. **Authentication** - User accounts with NextAuth
5. **Team Collaboration** - Multiple users per workspace
6. **Advanced Field Types** - Signature, payment, calculation fields
7. **Form Templates** - Pre-built templates for common use cases
8. **A/B Testing** - Test different form versions
9. **Custom Branding** - White-label with custom domains
10. **API Access** - REST API for programmatic access

---

## 💬 Support

- **Issues**: Report bugs on GitHub
- **Documentation**: See README.md for full details
- **Examples**: Check `/forms` for sample forms

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects!
