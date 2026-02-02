import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/azure/client';

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
      const { data, error: fetchError } = await supabase
        .from('lessor_invoices')
        .select('*')
        .eq('lessor_id', lessorId)
        .order('issued_date', { ascending: false });

      if (fetchError) throw fetchError;
      setInvoices(data || []);
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

        const { data, error: insertError } = await supabase
          .from('lessor_invoices')
          .insert(invoiceData)
          .select();

        if (insertError) throw insertError;

        if (data && data[0]) {
          setInvoices((prev) => [data[0], ...prev]);
        }

        return data?.[0];
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

        const { data, error: updateError } = await supabase
          .from('lessor_invoices')
          .update(input)
          .eq('id', id)
          .eq('lessor_id', lessorId)
          .select();

        if (updateError) throw updateError;

        if (data && data[0]) {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === id ? data[0] : inv))
          );
        }

        return data?.[0];
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

        const { error: deleteError } = await supabase
          .from('lessor_invoices')
          .delete()
          .eq('id', id)
          .eq('lessor_id', lessorId);

        if (deleteError) throw deleteError;

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
