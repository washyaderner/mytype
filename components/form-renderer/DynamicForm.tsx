'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FormConfig, FieldConfig, FormResponse } from '@/types';
import { validateFieldValue, calculateProgress, formatProgress } from '@/utils/form-helpers';
import { sanitizeResponseData } from '@/utils/security';
import {
  TextField,
  TextareaField,
  DateField,
  MultipleChoiceField,
  DropdownField,
  YesNoField,
  RatingField,
  OpinionScaleField,
  FileUploadField,
  StatementField,
} from './fields';

interface DynamicFormProps {
  form: FormConfig;
  onSubmit: (data: Record<string, any>) => void;
  onSaveProgress?: (data: Record<string, any>, currentStep: number) => void;
}

/**
 * Dynamic Form Component
 *
 * Renders forms one question at a time with smooth animations
 * SECURITY: All responses sanitized before submission
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  form,
  onSubmit,
  onSaveProgress,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentField = form.fields[currentStep];
  const isLastField = currentStep === form.fields.length - 1;
  const progress = calculateProgress(currentStep, form.fields.length);

  // Auto-save progress
  useEffect(() => {
    if (onSaveProgress && Object.keys(formData).length > 0) {
      onSaveProgress(formData, currentStep);
    }
  }, [formData, currentStep, onSaveProgress]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // SECURITY: Sanitize all response data
    const sanitizedData = sanitizeResponseData(formData);

    try {
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ _form: 'Failed to submit form. Please try again.' });
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  const validateCurrentField = useCallback((): boolean => {
    if (!currentField) return true;

    // Skip validation for statement fields
    if (currentField.type === 'statement') return true;

    const value = formData[currentField.id];
    const validation = validateFieldValue(currentField, value);

    if (!validation.isValid) {
      setErrors({ [currentField.id]: validation.error || 'Invalid input' });
      return false;
    }

    setErrors({});
    return true;
  }, [currentField, formData]);

  const handleNext = useCallback(() => {
    if (!validateCurrentField()) {
      // Trigger shake animation (handled by field components)
      return;
    }

    if (isLastField) {
      handleSubmit();
    } else {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  }, [validateCurrentField, isLastField, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  }, [handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderField = (field: FieldConfig) => {
    const value = formData[field.id];
    const error = errors[field.id];

    const commonProps = {
      field,
      error,
      autoFocus: true,
    };

    switch (field.type) {
      case 'short_text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <TextField
            {...commonProps}
            value={value || ''}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'long_text':
        return (
          <TextareaField
            {...commonProps}
            value={value || ''}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'date':
        return (
          <DateField
            {...commonProps}
            value={value || ''}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoiceField
            {...commonProps}
            value={value || (field.allowMultiple ? [] : '')}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'dropdown':
        return (
          <DropdownField
            {...commonProps}
            value={value || ''}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'yes_no':
        return (
          <YesNoField
            {...commonProps}
            value={value ?? null}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'rating':
        return (
          <RatingField
            {...commonProps}
            value={value ?? null}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'opinion_scale':
        return (
          <OpinionScaleField
            {...commonProps}
            value={value ?? null}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'file_upload':
        return (
          <FileUploadField
            {...commonProps}
            value={value || null}
            onChange={(v) => handleFieldChange(field.id, v)}
          />
        );

      case 'statement':
        return <StatementField field={field} onContinue={handleNext} />;

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  if (!currentField) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">No fields to display</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col">
      {/* Progress Bar */}
      {form.settings.showProgressBar !== false && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Text */}
          {form.settings.showProgressBar !== false && (
            <motion.p
              className="text-sm text-gray-500 mb-8 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {formatProgress(currentStep, form.fields.length, form.settings.progressBarType)}
            </motion.p>
          )}

          {/* Question Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{
                x: direction === 'forward' ? 300 : -300,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: direction === 'forward' ? -300 : 300,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="space-y-8"
            >
              {/* Question Number */}
              <motion.p
                className="text-lg font-medium text-purple-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentStep + 1} →
              </motion.p>

              {/* Question Title */}
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentField.title}
                {currentField.required && (
                  <span className="text-red-500 ml-2">*</span>
                )}
              </motion.h1>

              {/* Question Description */}
              {currentField.description && (
                <motion.p
                  className="text-lg text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentField.description}
                </motion.p>
              )}

              {/* Field Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {renderField(currentField)}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentField.type !== 'statement' && (
            <motion.div
              className="mt-12 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Back Button */}
              {form.settings.allowBackNavigation !== false && currentStep > 0 ? (
                <motion.button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </motion.button>
              ) : (
                <div />
              )}

              {/* Next/Submit Button */}
              <motion.button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    {isLastField ? 'Submit' : 'OK'}
                    {!isLastField && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Hint Text */}
          {currentField.type !== 'statement' && (
            <motion.p
              className="mt-6 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter ↵</kbd>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};
