import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { FormStore, FormConfig, FieldConfig, FormResponse } from '@/types';

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [],
      responses: [],
      currentForm: null,

      // Form CRUD operations
      createForm: (formData) => {
        const newForm: FormConfig = {
          ...formData,
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          forms: [...state.forms, newForm],
        }));

        return newForm;
      },

      updateForm: (id, updates) => {
        set((state) => ({
          forms: state.forms.map((form) =>
            form.id === id
              ? { ...form, ...updates, updatedAt: new Date().toISOString() }
              : form
          ),
        }));
      },

      deleteForm: (id) => {
        set((state) => ({
          forms: state.forms.filter((form) => form.id !== id),
          responses: state.responses.filter((response) => response.formId !== id),
          currentForm: state.currentForm?.id === id ? null : state.currentForm,
        }));
      },

      getForm: (id) => {
        return get().forms.find((form) => form.id === id);
      },

      duplicateForm: (id) => {
        const formToDuplicate = get().forms.find((form) => form.id === id);
        if (!formToDuplicate) return undefined;

        const duplicatedForm: FormConfig = {
          ...formToDuplicate,
          id: nanoid(),
          title: `${formToDuplicate.title} (Copy)`,
          fields: formToDuplicate.fields.map((field) => ({
            ...field,
            id: nanoid(),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          forms: [...state.forms, duplicatedForm],
        }));

        return duplicatedForm;
      },

      // Field operations
      addField: (formId, fieldData) => {
        const newField: FieldConfig = {
          ...fieldData,
          id: nanoid(),
        };

        set((state) => ({
          forms: state.forms.map((form) =>
            form.id === formId
              ? {
                  ...form,
                  fields: [...form.fields, newField],
                  updatedAt: new Date().toISOString(),
                }
              : form
          ),
        }));
      },

      updateField: (formId, fieldId, updates) => {
        set((state) => ({
          forms: state.forms.map((form) =>
            form.id === formId
              ? {
                  ...form,
                  fields: form.fields.map((field) =>
                    field.id === fieldId ? { ...field, ...updates } : field
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : form
          ),
        }));
      },

      deleteField: (formId, fieldId) => {
        set((state) => ({
          forms: state.forms.map((form) =>
            form.id === formId
              ? {
                  ...form,
                  fields: form.fields.filter((field) => field.id !== fieldId),
                  updatedAt: new Date().toISOString(),
                }
              : form
          ),
        }));
      },

      reorderFields: (formId, fieldIds) => {
        set((state) => ({
          forms: state.forms.map((form) =>
            form.id === formId
              ? {
                  ...form,
                  fields: fieldIds
                    .map((id) => form.fields.find((f) => f.id === id))
                    .filter((f): f is FieldConfig => f !== undefined),
                  updatedAt: new Date().toISOString(),
                }
              : form
          ),
        }));
      },

      // Response operations
      saveResponse: (responseData) => {
        const newResponse: FormResponse = {
          ...responseData,
          id: nanoid(),
        };

        set((state) => ({
          responses: [...state.responses, newResponse],
        }));
      },

      getResponses: (formId) => {
        return get().responses.filter((response) => response.formId === formId);
      },

      deleteResponse: (responseId) => {
        set((state) => ({
          responses: state.responses.filter((response) => response.id !== responseId),
        }));
      },

      // Current form operations
      setCurrentForm: (formId) => {
        const form = formId ? get().forms.find((f) => f.id === formId) : null;
        set({ currentForm: form || null });
      },
    }),
    {
      name: 'mytype-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
