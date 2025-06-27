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
