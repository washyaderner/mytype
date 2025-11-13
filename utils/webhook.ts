import type { FormConfig, FormResponse } from '@/types';

/**
 * Webhook Payload Format
 * Compatible with Make.com, n8n, Zapier, and standard webhook endpoints
 */
export interface WebhookPayload {
  event: 'form_response';
  form_id: string;
  form_title: string;
  response_id: string;
  submitted_at: string;
  form_response: {
    fields: Array<{
      field_id: string;
      field_type: string;
      field_title: string;
      value: any;
    }>;
  };
}

/**
 * Webhook Result
 */
export interface WebhookResult {
  success: boolean;
  attempts: number;
  error?: string;
  statusCode?: number;
}

/**
 * Send webhook with exponential backoff retry
 *
 * Retry logic:
 * - Attempt 1: immediate
 * - Attempt 2: after 2s
 * - Attempt 3: after 4s
 * - Attempt 4: after 8s
 *
 * SECURITY: User-provided URL - validate before calling
 */
export async function sendWebhook(
  form: FormConfig,
  response: FormResponse,
  webhookUrl: string,
  headers?: Record<string, string>,
  maxRetries: number = 3,
  initialDelayMs: number = 2000
): Promise<WebhookResult> {
  // Validate webhook URL
  if (!isValidWebhookUrl(webhookUrl)) {
    return {
      success: false,
      attempts: 0,
      error: 'Invalid webhook URL',
    };
  }

  // Build payload
  const payload = buildWebhookPayload(form, response);

  // Merge custom headers with defaults
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'MyType-Form-Webhook/1.0',
    ...headers,
  };

  // Attempt sending with retry logic
  let lastError: string = '';
  let lastStatusCode: number | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Wait before retry (skip on first attempt)
      if (attempt > 0) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        await sleep(delay);
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      lastStatusCode = response.status;

      // Success: 2xx status codes
      if (response.ok) {
        return {
          success: true,
          attempts: attempt + 1,
          statusCode: response.status,
        };
      }

      // Client error (4xx): Don't retry
      if (response.status >= 400 && response.status < 500) {
        const errorText = await response.text().catch(() => 'Unknown error');
        return {
          success: false,
          attempts: attempt + 1,
          error: `Client error: ${response.status} - ${errorText}`,
          statusCode: response.status,
        };
      }

      // Server error (5xx): Retry
      lastError = `Server error: ${response.status}`;
    } catch (error: any) {
      // Network errors: Retry
      lastError = error.message || 'Network error';

      // Abort error means timeout
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        lastError = 'Request timeout (10s)';
      }
    }
  }

  // All retries failed
  return {
    success: false,
    attempts: maxRetries + 1,
    error: lastError,
    statusCode: lastStatusCode,
  };
}

/**
 * Build webhook payload from form and response
 *
 * Format compatible with Make.com, n8n, Zapier
 */
export function buildWebhookPayload(
  form: FormConfig,
  response: FormResponse
): WebhookPayload {
  return {
    event: 'form_response',
    form_id: form.id,
    form_title: form.title,
    response_id: response.id,
    submitted_at: response.completedAt || response.startedAt,
    form_response: {
      fields: response.responses.map((fieldResponse) => {
        const field = form.fields.find((f) => f.id === fieldResponse.fieldId);
        return {
          field_id: fieldResponse.fieldId,
          field_type: fieldResponse.fieldType,
          field_title: field?.title || 'Unknown Field',
          value: fieldResponse.value,
        };
      }),
    },
  };
}

/**
 * Validate webhook URL
 *
 * SECURITY: Prevent SSRF attacks by validating URL
 */
export function isValidWebhookUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Block localhost and private IPs (basic SSRF prevention)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.20.') ||
      hostname.startsWith('172.21.') ||
      hostname.startsWith('172.22.') ||
      hostname.startsWith('172.23.') ||
      hostname.startsWith('172.24.') ||
      hostname.startsWith('172.25.') ||
      hostname.startsWith('172.26.') ||
      hostname.startsWith('172.27.') ||
      hostname.startsWith('172.28.') ||
      hostname.startsWith('172.29.') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.')
    ) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Test webhook URL
 *
 * Sends a test payload to verify the webhook is reachable
 */
export async function testWebhook(
  webhookUrl: string,
  headers?: Record<string, string>
): Promise<WebhookResult> {
  if (!isValidWebhookUrl(webhookUrl)) {
    return {
      success: false,
      attempts: 0,
      error: 'Invalid webhook URL',
    };
  }

  const testPayload = {
    event: 'test',
    message: 'This is a test webhook from MyType',
    timestamp: new Date().toISOString(),
  };

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'MyType-Form-Webhook/1.0',
    ...headers,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      return {
        success: true,
        attempts: 1,
        statusCode: response.status,
      };
    }

    const errorText = await response.text().catch(() => 'Unknown error');
    return {
      success: false,
      attempts: 1,
      error: `HTTP ${response.status}: ${errorText}`,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      attempts: 1,
      error: error.message || 'Network error',
    };
  }
}
