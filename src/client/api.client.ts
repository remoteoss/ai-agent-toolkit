import type {
  ListTimeOffParams,
  ListTimeOffResponse,
} from './timeoff.types';
import type {
  ListEmploymentsParams,
  ListEmploymentsResponse,
} from './employments.types';


export interface ApiClient {
  listTimeOff(params: ListTimeOffParams): Promise<ListTimeOffResponse>;
  listEmployments(params: ListEmploymentsParams): Promise<ListEmploymentsResponse>;
}

export class RemoteApiClient implements ApiClient {
  private apiKey: string;
  private baseUrl: string = 'https://gateway.remote.com/v1'; // Default base URL

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) {
      throw new Error('API key is required for RemoteApiClient');
    }
    this.apiKey = apiKey;
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
    queryParams?: Record<string, string | number | boolean | undefined>,
    body?: any
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
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
        } catch (e) {
        }
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
    return this.request<ListTimeOffResponse>('/timeoff', 'GET', params as Record<string, string | number | boolean | undefined>);
  }

  async listEmployments(params: ListEmploymentsParams): Promise<ListEmploymentsResponse> {
    return this.request<ListEmploymentsResponse>('/employments', 'GET', params as Record<string, string | number | boolean | undefined>);
  }
} 