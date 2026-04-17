export type ContractorInvoiceItemType = 'manual' | 'time_tracking' | 'expense';

export type ContractorInvoiceStatus =
  | 'enqueued'
  | 'externally_paid'
  | 'issued'
  | 'in_review'
  | 'pending_payment'
  | 'processing'
  | 'paid_out'
  | 'pay_out_failed'
  | 'rejected'
  | 'rejected_by_remote'
  | 'funds_returned'
  | 'manual_payout'
  | 'blocked';

export interface ContractorInvoiceItem {
  amount: number;
  description: string;
  type: ContractorInvoiceItemType;
}

export interface ContractorInvoice {
  id: string;
  employment_id?: string | null;
  number?: string | null;
  date: string;
  due_date?: string | null;
  approved_at?: string | null;
  contractor_invoice_schedule_id?: string | null;
  items: ContractorInvoiceItem[];
  amount: number;
  currency: string;
  source_amount: number;
  source_currency: string;
  target_amount?: number | null;
  target_currency?: string | null;
  description?: string | null;
  paid_out_at?: string | null;
  status: ContractorInvoiceStatus;
  fx_rate?: number | null;
  processing_fee?: number | null;
  processing_fee_currency?: string | null;
  processing_fee_payer?: 'company' | 'contractor' | null;
  pay_out_method?: 'local' | 'swift' | 'swift_our' | null;
}

export interface ListContractorInvoicesParams {
  status?: ContractorInvoiceStatus;
  date_from?: string;
  date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  approved_date_from?: string;
  approved_date_to?: string;
  paid_out_date_from?: string;
  paid_out_date_to?: string;
  sort_by?: 'date' | 'due_date' | 'approved_at' | 'paid_out_at';
  order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface ListContractorInvoicesResponse {
  contractor_invoices: ContractorInvoice[];
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface GetContractorInvoiceResponse {
  data: {
    contractor_invoice: ContractorInvoice;
  };
}
