// Expense types for MCP toolkit, based on OpenAPI spec

export interface ListExpensesParams {
  page?: number;
  page_size?: number;
}

export interface CurrencyDefinition {
  code: string;
  name: string;
  symbol: string;
}

export enum ExpenseCategory {
  CAR_RENTAL = 'car_rental',
  COWORKING_OFFICE = 'coworking_office',
  EDUCATION_TRAINING = 'education_training',
  ENTERTAINMENT = 'entertainment',
  FLIGHT = 'flight',
  FUEL = 'fuel',
  GIFTS = 'gifts',
  INSURANCE = 'insurance',
  LODGING = 'lodging',
  MEALS = 'meals',
  MILEAGE = 'mileage',
  OTHER = 'other',
  PARKING_TOLL = 'parking_toll',
  PER_DIEM = 'per_diem',
  SUBSCRIPTION = 'subscription',
  TECH_EQUIPMENT = 'tech_equipment',
  TELECOMMUNICATION = 'telecommunication',
  TRANSPORT = 'transport',
  UTILITIES = 'utilities',
  VACCINATION_TESTING = 'vaccination_testing',
  VISAS = 'visa',
  WELLNESS = 'wellness',
  COWORKING = 'coworking',
  HOME_OFFICE = 'home_office',
  PHONE_UTILITIES = 'phone_utilities',
  TRAVEL = 'travel',
}

export enum ExpenseStatus {
  CANCELED = 'canceled',
  PENDING = 'pending',
  DECLINED = 'declined',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  REIMBURSED = 'reimbursed',
}

export interface FileReceipt {
  id: string;
  inserted_at: string;
  name: string;
  sub_type: string;
  type: string;
}

export interface Expense {
  id: string;
  title: string;
  employment_id: string;
  amount: number;
  converted_amount: number;
  currency: CurrencyDefinition;
  converted_currency: CurrencyDefinition;
  expense_date: string;
  tax_amount: number;
  converted_tax_amount: number;
  receipts: FileReceipt[];
  status: ExpenseStatus;
  category: ExpenseCategory;
  invoice_period?: string | null;
  notes?: string | null;
  reason?: string | null;
  reviewed_at?: string | null;
  reviewer?: {
    user_email: string;
    user_id: string;
    user_name: string;
  } | null;
}

export interface ListExpensesResponse {
  data: {
    expenses: Expense[];
    total_count: number;
    total_pages: number;
    current_page: number;
  };
}

export interface Base64File {
  content: string; // base64 encoded
  name: string;
}

export interface CreateExpenseParams {
  expense_date: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  employment_id: string;
  tax_amount?: number;
  receipt?: Base64File;
  receipts?: Base64File[];
  reviewed_at?: string;
  reviewer_id?: string;
  timezone?: string;
}

export interface CreateExpenseResponse {
  data: {
    expense: Expense;
  };
}

export interface GetExpenseResponse {
  data: {
    expense: Expense;
  };
}

export type UpdateExpenseParams = { status: 'approved' } | { status: 'declined'; reason: string };

export interface UpdateExpenseResponse {
  data: {
    expense: Expense;
  };
}
