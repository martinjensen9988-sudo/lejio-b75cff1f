import { useQuery } from '@tanstack/react-query';
import { useTenant } from '@/providers/TenantProvider';
import { useFriAuthContext } from '@/providers/FriAuthProvider';

/**
 * Hook for fetching lessor dashboard statistics
 */
export function useFriStats() {
  const { apiBaseUrl } = useTenant();
  const { user } = useFriAuthContext();

  return useQuery({
    queryKey: ['friStats', user?.lessor_id],
    queryFn: async () => {
      if (!user?.lessor_id) throw new Error('No lessor_id');
      
      const response = await fetch(
        `${apiBaseUrl}/GetLessorStats?lessor_id=${user.lessor_id}`
      );
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user?.lessor_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching vehicles
 */
export function useFriVehicles() {
  const { apiBaseUrl } = useTenant();
  const { user } = useFriAuthContext();

  return useQuery({
    queryKey: ['friVehicles', user?.lessor_id],
    queryFn: async () => {
      if (!user?.lessor_id) throw new Error('No lessor_id');
      
      const response = await fetch(
        `${apiBaseUrl}/GetVehicles?lessor_id=${user.lessor_id}`
      );
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      return response.json();
    },
    enabled: !!user?.lessor_id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching bookings
 */
export function useFriBookings(status?: string) {
  const { apiBaseUrl } = useTenant();
  const { user } = useFriAuthContext();

  const queryParams = new URLSearchParams({
    lessor_id: user?.lessor_id || '',
    ...(status && { status }),
  });

  return useQuery({
    queryKey: ['friBookings', user?.lessor_id, status],
    queryFn: async () => {
      if (!user?.lessor_id) throw new Error('No lessor_id');
      
      const response = await fetch(
        `${apiBaseUrl}/GetBookings?${queryParams}`
      );
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user?.lessor_id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching invoices
 */
export function useFriInvoices(status?: string) {
  const { apiBaseUrl } = useTenant();
  const { user } = useFriAuthContext();

  const queryParams = new URLSearchParams({
    lessor_id: user?.lessor_id || '',
    ...(status && { status }),
  });

  return useQuery({
    queryKey: ['friInvoices', user?.lessor_id, status],
    queryFn: async () => {
      if (!user?.lessor_id) throw new Error('No lessor_id');
      
      const response = await fetch(
        `${apiBaseUrl}/GetInvoices?${queryParams}`
      );
      if (!response.ok) throw new Error('Failed to fetch invoices');
      return response.json();
    },
    enabled: !!user?.lessor_id,
    staleTime: 5 * 60 * 1000,
  });
}

// Legacy function - keeping for backward compatibility
import { useState, useCallback, useEffect } from 'react';
import { queryAzure } from '@/integrations/azure/clientFri';

/**
 * Get lessor account details by domain
 * Called from App.tsx to determine which lessor this is
 */
export function useFriAccount(domain: string | null) {
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!domain) {
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      try {
        setLoading(true);
        const result = await queryAzure(
          'SELECT * FROM lessor_accounts WHERE custom_domain = $1',
          [domain]
        );
        setAccount(result.rows[0] || null);
      } catch (err) {
        console.error('Error fetching lessor account:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [domain]);

  return { account, loading, error };
}

/**
 * Get fleet vehicles for this lessor
 */
export function useFriFleet(lessorAccountId: string | null) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!lessorAccountId) return;

    try {
      setLoading(true);
      const result = await queryAzure(
        'SELECT * FROM lessor_fleet_vehicles WHERE lessor_account_id = $1 ORDER BY created_at DESC',
        [lessorAccountId]
      );
      setVehicles(result.rows);
    } catch (err) {
      console.error('Error fetching fleet:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [lessorAccountId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { vehicles, loading, error, refetch: fetch };
}

/**
 * Get bookings for this lessor
 */
export function useFriBookings(lessorAccountId: string | null) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!lessorAccountId) return;

    try {
      setLoading(true);
      const result = await queryAzure(
        'SELECT * FROM lessor_bookings WHERE lessor_account_id = $1 ORDER BY rental_start DESC',
        [lessorAccountId]
      );
      setBookings(result.rows);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [lessorAccountId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { bookings, loading, error, refetch: fetch };
}

/**
 * Get team members for this lessor
 */
export function useFriTeam(lessorAccountId: string | null) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!lessorAccountId) return;

    try {
      setLoading(true);
      const result = await queryAzure(
        'SELECT * FROM lessor_team_members WHERE lessor_account_id = $1 AND active = true ORDER BY created_at',
        [lessorAccountId]
      );
      setMembers(result.rows);
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [lessorAccountId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { members, loading, error, refetch: fetch };
}

/**
 * Get invoices for this lessor
 */
export function useFriInvoices(lessorAccountId: string | null) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!lessorAccountId) return;

    try {
      setLoading(true);
      const result = await queryAzure(
        'SELECT * FROM lessor_invoices WHERE lessor_account_id = $1 ORDER BY issued_at DESC',
        [lessorAccountId]
      );
      setInvoices(result.rows);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [lessorAccountId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { invoices, loading, error, refetch: fetch };
}
