export type BillingDocumentItem = {
  type: string;
  billing_document_amount: number;
  billing_document_currency?: string;
  employment_id: string | null;
  source_amount: number;
  source_currency: string | null;
};

export type BillingDocumentType =
  | 'reconciliation_invoice'
  | 'prefunding_invoice'
  | 'supplemental_service_invoice'
  | 'reconciliation_credit_note';

export interface ListBillingDocument {
  id: string;
  bill_from?: string;
  billing_document_period: string;
  billing_document_type: BillingDocumentType;
}

export interface ListBillingDocumentsParams {
  period?: string;
  page?: number;
  page_size?: number;
}

export interface ListBillingDocumentsResponse {
  billing_documents: ListBillingDocument[];
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface ShowBillingDocumentParams {
  billing_document_id: string;
}

export interface BillingDocument {
  id: string;
  billing_document_currency: string;
  billing_document_number: string;
  billing_document_period: string;
  billing_document_type: string;
  company_id: string;
  issued_date: string;
  items: BillingDocumentItem[];
}

export interface ShowBillingDocumentResponse {
  billing_document: BillingDocument;
}

export interface BillingDocumentBreakdown {
  country_code: string;
  description: string;
  employment_id: string;
  fx_rate: string;
  invoice_amount: number;
  invoice_currency: string | null; // Currency code in ISO 4217 format.
  invoice_number: string;
  invoice_period: string;
  source_amount: number;
  source_currency: string | null;
  type: string;
  variance_from_invoice: number | null;
}

export interface GetBillingDocumentBreakdownParams {
  type: string;
}

export interface GetBillingDocumentBreakdownResponse {
  billing_document_breakdown: BillingDocumentBreakdown[];
}
