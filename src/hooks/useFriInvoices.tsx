import { useState, useEffect, useCallback } from 'react';
import { azureApi } from '@/integrations/azure/client';

export interface Invoice {
  id: string;
  lessor_id: string;
  booking_id?: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  tax_amount?: number;
  description: string;
  issued_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceInput {
  booking_id?: string;
  invoice_number?: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  tax_amount?: number;
  description: string;
  issued_date: string;
  due_date: string;
  payment_method?: string;
  notes?: string;
}

export function useFriInvoices(lessorId: string | null) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const escapeSqlValue = (value: string) => value.replace(/'/g, "''");

  const normalizeRows = (response: any) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.recordset)) return response.recordset;
    if (Array.isArray(response.data?.recordset)) return response.data.recordset;
    return response.data ?? response;
  };

  // Generate invoice number
  const generateInvoiceNumber = useCallback((): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }, []);

  // Fetch all invoices for the lessor
  const fetch = useCallback(async () => {
    if (!lessorId) return;

    setLoading(true);
    setError(null);

    try {
      const safeLessorId = escapeSqlValue(lessorId);
      const response = await azureApi.post<any>('/db/query', {
        query: `SELECT * FROM fri_invoices WHERE lessor_id='${safeLessorId}' ORDER BY issued_date DESC`,
      });

      const rows = normalizeRows(response) as Invoice[];
      setInvoices(rows || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(message);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [lessorId]);

  // Auto-fetch when component mounts or lessorId changes
  useEffect(() => {
    if (lessorId) {
      fetch();
    }
  }, [lessorId, fetch]);

  // Create a new invoice
  const addInvoice = useCallback(
    async (input: CreateInvoiceInput) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const invoiceData = {
          lessor_id: lessorId,
          invoice_number: input.invoice_number || generateInvoiceNumber(),
          ...input,
          status: 'draft',
        };

        const columns = [
          'lessor_id',
          'booking_id',
          'invoice_number',
          'customer_name',
          'customer_email',
          'amount',
          'tax_amount',
          'description',
          'issued_date',
          'due_date',
          'status',
          'payment_method',
          'notes',
        ];
        const values = [
          `'${escapeSqlValue(lessorId)}'`,
          invoiceData.booking_id ? `'${escapeSqlValue(invoiceData.booking_id)}'` : null,
          `'${escapeSqlValue(invoiceData.invoice_number)}'`,
          `'${escapeSqlValue(invoiceData.customer_name)}'`,
          `'${escapeSqlValue(invoiceData.customer_email)}'`,
          invoiceData.amount,
          invoiceData.tax_amount ?? null,
          `'${escapeSqlValue(invoiceData.description)}'`,
          `'${escapeSqlValue(invoiceData.issued_date)}'`,
          `'${escapeSqlValue(invoiceData.due_date)}'`,
          `'${escapeSqlValue(invoiceData.status)}'`,
          invoiceData.payment_method ? `'${escapeSqlValue(invoiceData.payment_method)}'` : null,
          invoiceData.notes ? `'${escapeSqlValue(invoiceData.notes)}'` : null,
        ];

        await azureApi.post('/db/query', {
          query: `INSERT INTO fri_invoices (${columns.join(', ')}) VALUES (${values.map(v => (v === null ? 'NULL' : v)).join(', ')})`,
        });

        await fetch();
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create invoice';
        setError(message);
        throw err;
      }
    },
    [lessorId, generateInvoiceNumber]
  );

  // Update an invoice
  const updateInvoice = useCallback(
    async (id: string, input: Partial<CreateInvoiceInput>) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const setClauses = Object.entries(input)
          .map(([key, value]) => {
            if (value === undefined) return null;
            if (value === null) return `${key}=NULL`;
            if (typeof value === 'number') return `${key}=${value}`;
            return `${key}='${escapeSqlValue(String(value))}'`;
          })
          .filter(Boolean)
          .join(', ');

        if (!setClauses) return null;

        await azureApi.post('/db/query', {
          query: `UPDATE fri_invoices SET ${setClauses} WHERE id='${escapeSqlValue(id)}' AND lessor_id='${escapeSqlValue(lessorId)}'`,
        });

        await fetch();
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update invoice';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Delete an invoice
  const deleteInvoice = useCallback(
    async (id: string) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        await azureApi.post('/db/query', {
          query: `DELETE FROM fri_invoices WHERE id='${escapeSqlValue(id)}' AND lessor_id='${escapeSqlValue(lessorId)}'`,
        });

        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete invoice';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update invoice status
  const updateStatus = useCallback(
    async (id: string, status: Invoice['status']) => {
      return updateInvoice(id, { status } as any);
    },
    [updateInvoice]
  );

  // Send invoice (mark as sent)
  const sendInvoice = useCallback(
    async (id: string) => {
      return updateStatus(id, 'sent');
    },
    [updateStatus]
  );

  // Mark as paid
  const markAsPaid = useCallback(
    async (id: string, paymentMethod?: string) => {
      return updateInvoice(id, { status: 'paid', payment_method: paymentMethod } as any);
    },
    [updateInvoice]
  );

  // Calculate total (amount + tax)
  const calculateTotal = (amount: number, tax?: number): number => {
    return amount + (tax || 0);
  };

  // Check if invoice is overdue
  const isOverdue = (invoice: Invoice): boolean => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false;
    return new Date(invoice.due_date) < new Date();
  };

  return {
    invoices,
    loading,
    error,
    refetch: fetch,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    updateStatus,
    sendInvoice,
    markAsPaid,
    calculateTotal,
    isOverdue,
    generateInvoiceNumber,
  };
}
