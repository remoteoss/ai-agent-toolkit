import type {
  ListCompanyManagersParams,
  ListCompanyManagersResponse,
} from "./companyManager.types";
import type {
  ListEmploymentsParams,
  ListEmploymentsResponse,
} from "./employments.types";
import type {
  ListPayrollRunsParams,
  ListPayrollRunsResponse,
  ShowPayrollRunParams,
  ShowPayrollRunResponse,
} from "./payroll.types";
import type {
  CreateTimeOffResponse,
  GetTimeOffResponse,
  ListTimeOffParams,
  ListTimeOffResponse,
  ListTimeOffTypesResponse,
  TimeOffActionResponse,
  TimeOffBalanceResponse,
  TimeOffParams,
  UpdateTimeOffResponse,
} from "./timeoff.types";

export interface ApiClient {
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  listEmployments(
    params: ListEmploymentsParams,
  ): Promise<ListEmploymentsResponse>;
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  createTimeOff(params: TimeOffParams): Promise<CreateTimeOffResponse>;
  updateTimeOff(params: TimeOffParams): Promise<UpdateTimeOffResponse>;
  getTimeOff(id: string): Promise<GetTimeOffResponse>;
  approveTimeOff(id: string): Promise<TimeOffActionResponse>;
  cancelTimeOff(
    id: string,
    cancel_reason?: string,
  ): Promise<TimeOffActionResponse>;
  declineTimeOff(id: string): Promise<TimeOffActionResponse>;
  approveCancelRequest(id: string): Promise<TimeOffActionResponse>;
  declineCancelRequest(id: string): Promise<TimeOffActionResponse>;
  listTimeOffTypes(): Promise<ListTimeOffTypesResponse>;
  getTimeOffBalance(employment_id: string): Promise<TimeOffBalanceResponse>;
  listCompanyManagers(
    params: ListCompanyManagersParams,
  ): Promise<ListCompanyManagersResponse>;
}

export interface ApiClient {
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  listEmployments(
    params: ListEmploymentsParams,
  ): Promise<ListEmploymentsResponse>;
  listPayrollRuns(
    params: ListPayrollRunsParams,
  ): Promise<ListPayrollRunsResponse>;
  showPayrollRun(params: ShowPayrollRunParams): Promise<ShowPayrollRunResponse>;
}

export class RemoteApiClient implements ApiClient {
  private apiKey: string;
  private baseUrl: string = "https://gateway.remote.com/v1"; // Default base URL

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error("API key is required for RemoteApiClient");
    }
    this.apiKey = apiKey;
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
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
      "Content-Type": "application/json",
      Accept: "application/json",
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
          console.error("Parsed API Error:", parsedError);
        } catch (e) {}
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error(
        `API Request Failed for ${method} ${url.toString()}:`,
        error,
      );
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `A non-Error object was thrown from API request: ${String(error)}`,
      );
    }
  }

  async listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse> {
    return this.request<ListTimeOffResponse>(
      "/timeoff",
      "GET",
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async createTimeOff(params: TimeOffParams): Promise<CreateTimeOffResponse> {
    return this.request<CreateTimeOffResponse>(
      "/timeoff",
      "POST",
      undefined,
      params,
    );
  }

  async updateTimeOff(params: TimeOffParams): Promise<UpdateTimeOffResponse> {
    const { id, ...updateFields } = params;
    return this.request<UpdateTimeOffResponse>(
      `/timeoff/${id}`,
      "PATCH",
      undefined,
      updateFields,
    );
  }

  async getTimeOff(id: string): Promise<GetTimeOffResponse> {
    return this.request<GetTimeOffResponse>(`/timeoff/${id}`, "GET");
  }

  async approveTimeOff(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(
      `/timeoff/${id}/approve`,
      "POST",
    );
  }

  async cancelTimeOff(
    id: string,
    cancel_reason: string,
  ): Promise<TimeOffActionResponse> {
    const body = { cancel_reason };
    return this.request<TimeOffActionResponse>(
      `/timeoff/${id}/cancel`,
      "POST",
      undefined,
      body,
    );
  }

  async declineTimeOff(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(
      `/timeoff/${id}/decline`,
      "POST",
    );
  }

  async approveCancelRequest(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(
      `/timeoff/${id}/cancel-request/approve`,
      "POST",
    );
  }

  async declineCancelRequest(id: string): Promise<TimeOffActionResponse> {
    return this.request<TimeOffActionResponse>(
      `/timeoff/${id}/cancel-request/decline`,
      "POST",
    );
  }

  async listTimeOffTypes(): Promise<ListTimeOffTypesResponse> {
    return this.request<ListTimeOffTypesResponse>(`/timeoff-types`, "GET");
  }

  async getTimeOffBalance(
    employment_id: string,
  ): Promise<TimeOffBalanceResponse> {
    return this.request<TimeOffBalanceResponse>(
      `/timeoff-balances/${employment_id}`,
      "GET",
    );
  }

  async listCompanyManagers(
    params: ListCompanyManagersParams,
  ): Promise<ListCompanyManagersResponse> {
    return this.request<ListCompanyManagersResponse>(
      "/company-managers",
      "GET",
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async listEmployments(
    params: ListEmploymentsParams,
  ): Promise<ListEmploymentsResponse> {
    return this.request<ListEmploymentsResponse>(
      "/employments",
      "GET",
      params as Record<string, string | number | boolean | undefined>,
    );
  }
  async listPayrollRuns(
    params: ListPayrollRunsParams,
  ): Promise<ListPayrollRunsResponse> {
    return this.request<ListPayrollRunsResponse>(
      "/payroll-runs",
      "GET",
      params as Record<string, string | number | boolean | undefined>,
    );
  }

  async showPayrollRun(
    params: ShowPayrollRunParams,
  ): Promise<ShowPayrollRunResponse> {
    const { payroll_run_id } = params;
    return this.request<ShowPayrollRunResponse>(
      `/payroll-runs/${payroll_run_id}`,
      "GET",
    );
  }
}
