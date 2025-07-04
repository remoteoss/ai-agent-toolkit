import type {
  ListCompanyManagersParams,
  ListCompanyManagersResponse,
} from './companyManager.types';
import type {
  ListEmploymentsParams,
  ListEmploymentsResponse,
  ShowEmploymentParams,
  ShowEmploymentResponse,
} from './employments.types';
import type { ListIncentivesParams, ListIncentivesResponse } from './incentives.types';
import type {
  ListPayrollRunsParams,
  ListPayrollRunsResponse,
  ShowPayrollRunParams,
  ShowPayrollRunResponse,
  ListPayslipsParams,
  ListPayslipsResponse,
} from './payroll.types';
import type {
  CreateTimeOffResponse,
  DeclineTimeOffParams,
  GetTimeOffResponse,
  ListTimeOffParams,
  ListTimeOffResponse,
  ListTimeOffTypesResponse,
  TimeOffActionResponse,
  ListLeavePoliciesSummaryResponse,
  ListLeavePoliciesDetailsResponse,
  TimeOffParams,
  UpdateTimeOffResponse,
} from './timeoff.types';
import type {
  ListExpensesParams,
  ListExpensesResponse,
  CreateExpenseParams,
  CreateExpenseResponse,
  GetExpenseResponse,
  UpdateExpenseParams,
  UpdateExpenseResponse,
} from './expense.types';
import type {
  ListTimesheetsParams,
  ListTimesheetsResponse,
  GetTimesheetResponse,
  ApproveTimesheetResponse,
  SendBackTimesheetParams,
  SentBackTimesheetResponse,
} from './timesheet.types';
import type {
  ListBillingDocumentsParams,
  ListBillingDocumentsResponse,
  ShowBillingDocumentParams,
  ShowBillingDocumentResponse,
  GetBillingDocumentBreakdownParams,
  GetBillingDocumentBreakdownResponse,
} from './billing.types';

export interface ApiClient {
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  listEmployments(params: ListEmploymentsParams): Promise<ListEmploymentsResponse>;
  listIncentives(params: ListIncentivesParams): Promise<ListIncentivesResponse>;
  showEmployment(params: ShowEmploymentParams): Promise<ShowEmploymentResponse>;
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  createTimeOff(params: TimeOffParams): Promise<CreateTimeOffResponse>;
  updateTimeOff(params: TimeOffParams): Promise<UpdateTimeOffResponse>;
  getTimeOff(id: string): Promise<GetTimeOffResponse>;
  approveTimeOff(id: string, approver_id: string): Promise<TimeOffActionResponse>;
  cancelTimeOff(id: string, cancel_reason?: string): Promise<TimeOffActionResponse>;
  declineTimeOff(params: DeclineTimeOffParams): Promise<TimeOffActionResponse>;
  approveCancelRequest(id: string): Promise<TimeOffActionResponse>;
  declineCancelRequest(id: string): Promise<TimeOffActionResponse>;
  listTimeOffTypes(): Promise<ListTimeOffTypesResponse>;
  getLeavePoliciesSummary(employment_id: string): Promise<ListLeavePoliciesSummaryResponse>;
  getLeavePoliciesDetails(employment_id: string): Promise<ListLeavePoliciesDetailsResponse>;
  listCompanyManagers(params: ListCompanyManagersParams): Promise<ListCompanyManagersResponse>;
  listPayrollRuns(params: ListPayrollRunsParams): Promise<ListPayrollRunsResponse>;
  showPayrollRun(params: ShowPayrollRunParams): Promise<ShowPayrollRunResponse>;
  listPayslips(params: ListPayslipsParams): Promise<ListPayslipsResponse>;
  listExpenses(params: ListExpensesParams): Promise<ListExpensesResponse>;
  createExpense(params: CreateExpenseParams): Promise<CreateExpenseResponse>;
  getExpense(id: string): Promise<GetExpenseResponse>;
  updateExpense(id: string, params: UpdateExpenseParams): Promise<UpdateExpenseResponse>;
  listTimesheets(params: ListTimesheetsParams): Promise<ListTimesheetsResponse>;
  getTimesheet(id: string): Promise<GetTimesheetResponse>;
  approveTimesheet(id: string): Promise<ApproveTimesheetResponse>;
  sendBackTimesheet(
    id: string,
    params: SendBackTimesheetParams,
  ): Promise<SentBackTimesheetResponse>;
  listBillingDocuments(params: ListBillingDocumentsParams): Promise<ListBillingDocumentsResponse>;
  showBillingDocument(params: ShowBillingDocumentParams): Promise<ShowBillingDocumentResponse>;
  getBillingDocumentBreakdown(
    billing_document_id: string,
    params: GetBillingDocumentBreakdownParams,
  ): Promise<GetBillingDocumentBreakdownResponse>;
}

export class RemoteApiClient implements ApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error('API key is required for RemoteApiClient');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || this.determineBaseUrlFromApiKey(apiKey);
  }

  private determineBaseUrlFromApiKey(apiKey: string): string {
    if (apiKey.startsWith('ra_test_')) {
      return 'https://gateway.remote-sandbox.com/v1';
    }
    return 'https://gateway.remote.com/v1';
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
    queryParams?: Record<string, string | number | boolean | undefined>,
    body?: any,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        if (errorBody) {
          errorMessage += ` - ${errorBody}`;
        }
        try {
          const parsedError = JSON.parse(errorBody);
          console.error('Parsed API Error:', parsedError);
        } catch {}
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`API Request Failed for ${method} ${url.toString()}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`A non-Error object was thrown from API request: ${String(error)}`);
    }
  }

  async listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse> {
    return this.request<ListTimeOffResponse>(
      '/timeoff',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async createTimeOff(params: TimeOffParams): Promise<CreateTimeOffResponse> {
    return this.request<CreateTimeOffResponse>('/timeoff', 'POST', undefined, params);
  }

  async updateTimeOff(params: TimeOffParams): Promise<UpdateTimeOffResponse> {
    const { id, ...updateFields } = params;
    return this.request<UpdateTimeOffResponse>(`/timeoff/${id}`, 'PATCH', undefined, updateFields);
  }

  async getTimeOff(id: string): Promise<GetTimeOffResponse> {
    return this.request<GetTimeOffResponse>(`/timeoff/${id}`, 'GET');
  }

  async approveTimeOff(id: string, approver_id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(`/timeoff/${id}/approve`, 'POST', undefined, {
      approver_id,
    });
  }

  async cancelTimeOff(id: string, cancel_reason: string): Promise<TimeOffActionResponse> {
    const body = { cancel_reason };
    return this.request<TimeOffActionResponse>(`/timeoff/${id}/cancel`, 'POST', undefined, body);
  }

  async declineTimeOff(params: DeclineTimeOffParams): Promise<TimeOffActionResponse> {
    const { id, decline_reason } = params;
    return this.request<TimeOffActionResponse>(`/timeoff/${id}/decline`, 'POST', undefined, {
      decline_reason,
    });
  }

  async approveCancelRequest(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(`/timeoff/${id}/cancel-request/approve`, 'POST');
  }

  async declineCancelRequest(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(`/timeoff/${id}/cancel-request/decline`, 'POST');
  }

  async listTimeOffTypes(): Promise<ListTimeOffTypesResponse> {
    return this.request<ListTimeOffTypesResponse>(`/timeoff/types`, 'GET');
  }

  async getLeavePoliciesSummary(employment_id: string): Promise<ListLeavePoliciesSummaryResponse> {
    return this.request<ListLeavePoliciesSummaryResponse>(
      `/leave-policies/summary/${employment_id}`,
      'GET',
    );
  }

  async getLeavePoliciesDetails(employment_id: string): Promise<ListLeavePoliciesDetailsResponse> {
    return this.request<ListLeavePoliciesDetailsResponse>(
      `/leave-policies/details/${employment_id}`,
      'GET',
    );
  }

  async listCompanyManagers(
    params: ListCompanyManagersParams,
  ): Promise<ListCompanyManagersResponse> {
    return this.request<ListCompanyManagersResponse>(
      '/company-managers',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async listEmployments(params: ListEmploymentsParams): Promise<ListEmploymentsResponse> {
    return this.request<ListEmploymentsResponse>(
      '/employments',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async showEmployment(params: ShowEmploymentParams): Promise<ShowEmploymentResponse> {
    const { employment_id } = params;
    return this.request<ShowEmploymentResponse>(`/employments/${employment_id}`, 'GET');
  }

  async listPayrollRuns(params: ListPayrollRunsParams): Promise<ListPayrollRunsResponse> {
    return this.request<ListPayrollRunsResponse>(
      '/payroll-runs',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async showPayrollRun(params: ShowPayrollRunParams): Promise<ShowPayrollRunResponse> {
    const { payroll_run_id } = params;
    return this.request<ShowPayrollRunResponse>(`/payroll-runs/${payroll_run_id}`, 'GET');
  }

  async listPayslips(params: ListPayslipsParams): Promise<ListPayslipsResponse> {
    return this.request<ListPayslipsResponse>(
      '/payslips',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async listExpenses(params: ListExpensesParams): Promise<ListExpensesResponse> {
    return this.request<ListExpensesResponse>(
      '/expenses',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async createExpense(params: CreateExpenseParams): Promise<CreateExpenseResponse> {
    return this.request<CreateExpenseResponse>('/expenses', 'POST', undefined, params);
  }

  async getExpense(id: string): Promise<GetExpenseResponse> {
    return this.request<GetExpenseResponse>(`/expenses/${id}`, 'GET');
  }

  async updateExpense(id: string, params: UpdateExpenseParams): Promise<UpdateExpenseResponse> {
    return this.request<UpdateExpenseResponse>(`/expenses/${id}`, 'PATCH', undefined, params);
  }

  async listTimesheets(params: ListTimesheetsParams): Promise<ListTimesheetsResponse> {
    return this.request<ListTimesheetsResponse>(
      '/timesheets',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async getTimesheet(id: string): Promise<GetTimesheetResponse> {
    return this.request<GetTimesheetResponse>(`/timesheets/${id}`, 'GET');
  }

  async approveTimesheet(id: string): Promise<ApproveTimesheetResponse> {
    return this.request<ApproveTimesheetResponse>(`/timesheets/${id}/approve`, 'POST');
  }

  async sendBackTimesheet(
    id: string,
    params: SendBackTimesheetParams,
  ): Promise<SentBackTimesheetResponse> {
    return this.request<SentBackTimesheetResponse>(
      `/timesheets/${id}/send-back`,
      'POST',
      undefined,
      params,
    );
  }

  async listIncentives(params: ListIncentivesParams): Promise<ListIncentivesResponse> {
    return this.request<ListIncentivesResponse>(
      '/incentives',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async listBillingDocuments(
    params: ListBillingDocumentsParams,
  ): Promise<ListBillingDocumentsResponse> {
    return this.request<ListBillingDocumentsResponse>(
      '/billing-documents',
      'GET',
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async showBillingDocument(
    params: ShowBillingDocumentParams,
  ): Promise<ShowBillingDocumentResponse> {
    const { billing_document_id } = params;
    return this.request<ShowBillingDocumentResponse>(
      `/billing-documents/${billing_document_id}`,
      'GET',
    );
  }
  async getBillingDocumentBreakdown(
    billing_document_id: string,
    params: GetBillingDocumentBreakdownParams,
  ): Promise<GetBillingDocumentBreakdownResponse> {
    return this.request<GetBillingDocumentBreakdownResponse>(
      `/billing-documents/${billing_document_id}/breakdown`,
      'GET',
    );
  }
}
