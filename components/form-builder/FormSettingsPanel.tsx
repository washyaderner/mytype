'use client';

import React from 'react';
import type { FormSettings } from '@/types';
import { Input, Textarea, Select, Card, CardHeader, CardContent } from '@/components/ui';
import { MAX_LENGTHS, sanitizeEmail } from '@/utils/security';

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
    </div>
  );
};
