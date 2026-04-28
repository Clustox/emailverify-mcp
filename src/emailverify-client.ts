/**
 * EmailVerify API Client
 * Handles communication with EmailVerify.io API endpoints using native fetch
 */

export interface EmailVerifyConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface EmailValidationResult {
  email: string;
  status: string;
  sub_status: string;
}

export interface BulkValidationResponse {
  status: string;
  task_id: number;
  count_submitted: number;
  count_duplicates_removed: number;
  count_rejected_emails: number;
  count_processing: number;
}

export interface BulkTaskResult {
  count_checked: number;
  count_total: number;
  name: string;
  progress_percentage: number;
  task_id: number;
  status: string;
  results: {
    email_batch: Array<{
      address: string;
      status: string;
      sub_status: string;
    }>;
  } | null;
}

export interface AccountBalanceResponse {
  api_status: string;
  daily_credits_limit: number;
  remaining_credits?: number;
  bonus_credits: number;
  remaining_daily_credits?: number;
}

export interface EmailFinderResult {
  email: string;
  status: string;
}

export class EmailVerifyClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: EmailVerifyConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://app.emailverify.io').replace(/\/$/, '');
  }

  private async request<T>(path: string, params: Record<string, any> = {}, options: RequestInit = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.append('key', this.apiKey);
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }

    // Add a 120-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json() as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Validate a single email address
   */
  async validateEmail(email: string): Promise<EmailValidationResult> {
    return this.request<EmailValidationResult>('/api/v1/validate', { email });
  }

  /**
   * Validate multiple email addresses in bulk
   */
  async validateBatch(emails: string[], title: string = 'Bulk Verification'): Promise<BulkValidationResponse> {
    if (emails.length > 250) {
      throw new Error('Batch size too large. Maximum 250 emails per task via MCP.');
    }
    const emailBatch = emails.map((address) => ({ address }));
    return this.request<BulkValidationResponse>('/api/v1/validate-batch', {}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_batch: emailBatch,
        title,
      }),
    });
  }

  /**
   * Get bulk validation task results
   */
  async getBulkResults(taskId: string | number): Promise<BulkTaskResult> {
    return this.request<BulkTaskResult>('/api/v1/get-result-bulk-verification-task', { task_id: taskId });
  }

  /**
   * Find an email address
   */
  async findEmail(name: string, domain: string): Promise<EmailFinderResult> {
    return this.request<EmailFinderResult>('/api/v1/finder', { name, domain });
  }

  /**
   * Validate API key
   */
  async validateKey(): Promise<{ valid: boolean }> {
    return this.request<{ valid: boolean }>('/api/v1/validate-key');
  }

  /**
   * Get account balance and status
   */
  async getAccountBalance(): Promise<AccountBalanceResponse> {
    return this.request<AccountBalanceResponse>('/api/v1/check-account-balance');
  }
}
