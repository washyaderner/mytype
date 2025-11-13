'use client';

import React, { useState } from 'react';
import type { FormSettings } from '@/types';
import { Input, Textarea, Select, Card, CardHeader, CardContent, Button } from '@/components/ui';
import { MAX_LENGTHS, sanitizeEmail } from '@/utils/security';
import { testWebhook } from '@/utils/webhook';

interface FormSettingsPanelProps {
  settings: FormSettings;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}

/**
 * Form Settings Panel Component
 *
 * SECURITY: All inputs sanitized, email validation
 */
export const FormSettingsPanel: React.FC<FormSettingsPanelProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [showWebhookAdvanced, setShowWebhookAdvanced] = useState(false);

  const handleTestWebhook = async () => {
    if (!settings.webhookUrl) {
      alert('⚠️ Please enter a webhook URL first');
      return;
    }

    setWebhookTesting(true);
    try {
      const result = await testWebhook(settings.webhookUrl, settings.webhookHeaders);

      if (result.success) {
        alert(`✅ Webhook test successful!\n\nStatus: ${result.statusCode}\nThe webhook endpoint is reachable.`);
      } else {
        alert(`❌ Webhook test failed\n\nError: ${result.error || 'Unknown error'}\n\nPlease check the URL and try again.`);
      }
    } catch (error) {
      alert('❌ Webhook test failed\n\nUnexpected error occurred.');
    } finally {
      setWebhookTesting(false);
    }
  };

  const handleUpdateWebhookHeader = (key: string, value: string) => {
    const headers = { ...(settings.webhookHeaders || {}) };
    if (value.trim()) {
      headers[key] = value;
    } else {
      delete headers[key];
    }
    onUpdateSettings({ webhookHeaders: headers });
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold text-gray-900">Form Settings</h2>

      {/* Appearance */}
      <Card padding="sm">
        <CardHeader title="Appearance" />
        <CardContent className="space-y-4">
          <Select
            label="Theme"
            value={settings.theme || 'light'}
            onChange={(value) => onUpdateSettings({ theme: value as any })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <Input
            label="Primary Color"
            type="color"
            value={settings.primaryColor || '#9333ea'}
            onChange={(value) => onUpdateSettings({ primaryColor: value })}
          />

          <Input
            label="Background Color"
            type="color"
            value={settings.backgroundColor || '#ffffff'}
            onChange={(value) => onUpdateSettings({ backgroundColor: value })}
          />
        </CardContent>
      </Card>

      {/* Behavior */}
      <Card padding="sm">
        <CardHeader title="Behavior" />
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.oneQuestionAtATime !== false}
              onChange={(e) => onUpdateSettings({ oneQuestionAtATime: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">One question at a time</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showProgressBar !== false}
              onChange={(e) => onUpdateSettings({ showProgressBar: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Show progress bar</span>
          </label>

          {settings.showProgressBar !== false && (
            <Select
              label="Progress Bar Type"
              value={settings.progressBarType || 'percentage'}
              onChange={(value) => onUpdateSettings({ progressBarType: value as any })}
              options={[
                { value: 'percentage', label: 'Percentage (50%)' },
                { value: 'proportion', label: 'Proportion (5/10)' },
              ]}
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.allowBackNavigation !== false}
              onChange={(e) => onUpdateSettings({ allowBackNavigation: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Allow back navigation</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.randomizeFieldOrder || false}
              onChange={(e) => onUpdateSettings({ randomizeFieldOrder: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Randomize question order</span>
          </label>
        </CardContent>
      </Card>

      {/* Submission */}
      <Card padding="sm">
        <CardHeader title="Submission" />
        <CardContent className="space-y-4">
          <Input
            label="Submit Button Text"
            value={settings.submitButtonText || 'Submit'}
            onChange={(value) => onUpdateSettings({ submitButtonText: value })}
            placeholder="Submit"
            maxLength={50}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showThankYouMessage !== false}
              onChange={(e) => onUpdateSettings({ showThankYouMessage: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Show thank you message</span>
          </label>

          {settings.showThankYouMessage !== false && (
            <Textarea
              label="Thank You Message"
              value={settings.thankYouMessage || ''}
              onChange={(value) => onUpdateSettings({ thankYouMessage: value })}
              placeholder="Thank you for your response!"
              rows={3}
              maxLength={MAX_LENGTHS.FORM_DESCRIPTION}
            />
          )}

          <Input
            label="Redirect URL (optional)"
            type="url"
            value={settings.redirectUrl || ''}
            onChange={(value) => onUpdateSettings({ redirectUrl: value })}
            placeholder="https://example.com/thank-you"
            maxLength={MAX_LENGTHS.URL}
          />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card padding="sm">
        <CardHeader title="Notifications" subtitle="Email notifications for new responses" />
        <CardContent className="space-y-4">
          <Input
            label="Notification Email (optional)"
            type="email"
            value={settings.notificationEmail || ''}
            onChange={(value) => {
              try {
                const sanitized = value ? sanitizeEmail(value) : '';
                onUpdateSettings({ notificationEmail: sanitized });
              } catch {
                // Invalid email, don't update
              }
            }}
            placeholder="notifications@example.com"
            maxLength={MAX_LENGTHS.EMAIL}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.sendConfirmationEmail || false}
              onChange={(e) => onUpdateSettings({ sendConfirmationEmail: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Send confirmation email to respondents</span>
          </label>

          {settings.sendConfirmationEmail && (
            <>
              <Input
                label="Confirmation Email Subject"
                value={settings.confirmationEmailSubject || ''}
                onChange={(value) => onUpdateSettings({ confirmationEmailSubject: value })}
                placeholder="Thanks for your response!"
                maxLength={200}
              />
              <Textarea
                label="Confirmation Email Body"
                value={settings.confirmationEmailBody || ''}
                onChange={(value) => onUpdateSettings({ confirmationEmailBody: value })}
                placeholder="We received your response..."
                rows={4}
                maxLength={MAX_LENGTHS.FORM_DESCRIPTION}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card padding="sm">
        <CardHeader
          title="Webhooks"
          subtitle="Send form responses to Make.com, n8n, Zapier, or custom endpoints"
        />
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.webhookEnabled || false}
              onChange={(e) => onUpdateSettings({ webhookEnabled: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable webhook notifications</span>
          </label>

          {settings.webhookEnabled && (
            <>
              <Input
                label="Webhook URL"
                value={settings.webhookUrl || ''}
                onChange={(value) => onUpdateSettings({ webhookUrl: value })}
                placeholder="https://hooks.make.com/..."
                maxLength={500}
                helperText="We'll POST form responses to this URL when submitted"
              />

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleTestWebhook}
                  isLoading={webhookTesting}
                  disabled={!settings.webhookUrl}
                >
                  {webhookTesting ? 'Testing...' : 'Test Webhook'}
                </Button>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowWebhookAdvanced(!showWebhookAdvanced)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {showWebhookAdvanced ? '▼' : '▶'} Advanced Settings
                </button>

                {showWebhookAdvanced && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Headers (Optional)
                      </label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="X-API-Key"
                            value={Object.keys(settings.webhookHeaders || {})[0] || ''}
                            onChange={(value) => {
                              const oldKey = Object.keys(settings.webhookHeaders || {})[0];
                              if (oldKey) {
                                const oldValue = settings.webhookHeaders?.[oldKey] || '';
                                const headers = { ...(settings.webhookHeaders || {}) };
                                delete headers[oldKey];
                                if (value.trim()) headers[value] = oldValue;
                                onUpdateSettings({ webhookHeaders: headers });
                              } else {
                                handleUpdateWebhookHeader(value, '');
                              }
                            }}
                            maxLength={100}
                          />
                          <Input
                            placeholder="your-api-key-here"
                            value={Object.values(settings.webhookHeaders || {})[0] || ''}
                            onChange={(value) => {
                              const key = Object.keys(settings.webhookHeaders || {})[0];
                              if (key) handleUpdateWebhookHeader(key, value);
                            }}
                            maxLength={200}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Add authentication headers like X-API-Key, Authorization, etc.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Max Retries"
                        type="number"
                        min={0}
                        max={5}
                        value={String(settings.webhookRetryCount ?? 3)}
                        onChange={(value) => onUpdateSettings({ webhookRetryCount: parseInt(value) || 3 })}
                        helperText="Number of retry attempts"
                      />
                      <Input
                        label="Initial Retry Delay (ms)"
                        type="number"
                        min={1000}
                        max={10000}
                        step={1000}
                        value={String(settings.webhookRetryDelay ?? 2000)}
                        onChange={(value) => onUpdateSettings({ webhookRetryDelay: parseInt(value) || 2000 })}
                        helperText="Delay before first retry"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Retry Logic</h4>
                      <p className="text-xs text-blue-700">
                        Failed webhooks are automatically retried with exponential backoff:
                        <br />
                        • Attempt 1: Immediate
                        <br />
                        • Attempt 2: {settings.webhookRetryDelay || 2000}ms delay
                        <br />
                        • Attempt 3: {(settings.webhookRetryDelay || 2000) * 2}ms delay
                        <br />• Attempt 4: {(settings.webhookRetryDelay || 2000) * 4}ms delay
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Payload Format</h4>
                      <pre className="text-xs text-gray-700 overflow-x-auto">
                        {JSON.stringify(
                          {
                            event: 'form_response',
                            form_id: 'abc123',
                            form_title: 'Your Form',
                            response_id: 'xyz789',
                            submitted_at: '2024-01-15T10:30:00Z',
                            form_response: {
                              fields: [
                                {
                                  field_id: 'field1',
                                  field_type: 'short_text',
                                  field_title: 'Your Name',
                                  value: 'John Doe',
                                },
                              ],
                            },
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
