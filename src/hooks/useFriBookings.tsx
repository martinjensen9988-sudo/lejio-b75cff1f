import { useState, useEffect, useCallback } from 'react';
import { azureApi } from '@/integrations/azure/client';

export interface Booking {
  id: string;
  lessor_id: string;
  vehicle_id: string;
  vehicle_make?: string;
  vehicle_model?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingInput {
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price?: number;
  notes?: string;
}

export function useFriBookings(lessorId: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  // Fetch all bookings for the lessor
  const fetch = useCallback(async () => {
    if (!lessorId) return;

    setLoading(true);
    setError(null);

    try {
      const safeLessorId = escapeSqlValue(lessorId);
      const response = await azureApi.post<any>('/db/query', {
        query: `SELECT * FROM fri_bookings WHERE lessor_id='${safeLessorId}' ORDER BY start_date DESC`,
      });

      const rows = normalizeRows(response) as Booking[];
      setBookings(rows || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      console.error('Error fetching bookings:', err);
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

  // Create a new booking
  const addBooking = useCallback(
    async (input: CreateBookingInput) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const safeLessorId = escapeSqlValue(lessorId);
        const columns = [
          'lessor_id',
          'vehicle_id',
          'customer_name',
          'customer_email',
          'customer_phone',
          'start_date',
          'end_date',
          'total_price',
          'notes',
          'status',
        ];
        const values = [
          `'${safeLessorId}'`,
          `'${escapeSqlValue(input.vehicle_id)}'`,
          `'${escapeSqlValue(input.customer_name)}'`,
          `'${escapeSqlValue(input.customer_email)}'`,
          `'${escapeSqlValue(input.customer_phone)}'`,
          `'${escapeSqlValue(input.start_date)}'`,
          `'${escapeSqlValue(input.end_date)}'`,
          input.total_price ?? null,
          input.notes ? `'${escapeSqlValue(input.notes)}'` : null,
          `'pending'`,
        ];

        await azureApi.post('/db/query', {
          query: `INSERT INTO fri_bookings (${columns.join(', ')}) VALUES (${values.map(v => (v === null ? 'NULL' : v)).join(', ')})`,
        });

        await fetch();
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update a booking
  const updateBooking = useCallback(
    async (id: string, input: Partial<CreateBookingInput>) => {
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
          query: `UPDATE fri_bookings SET ${setClauses} WHERE id='${escapeSqlValue(id)}' AND lessor_id='${escapeSqlValue(lessorId)}'`,
        });

        await fetch();
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Delete a booking
  const deleteBooking = useCallback(
    async (id: string) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        await azureApi.post('/db/query', {
          query: `DELETE FROM fri_bookings WHERE id='${escapeSqlValue(id)}' AND lessor_id='${escapeSqlValue(lessorId)}'`,
        });

        setBookings((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update booking status
  const updateStatus = useCallback(
    async (id: string, status: Booking['status']) => {
      return updateBooking(id, { status } as any);
    },
    [updateBooking]
  );

  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetch,
    addBooking,
    updateBooking,
    deleteBooking,
    updateStatus,
    calculateDays,
  };
}
