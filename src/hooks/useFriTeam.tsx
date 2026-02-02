import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/azure/client';

export interface TeamMember {
  id: string;
  lessor_id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'admin' | 'manager' | 'viewer';
  status: 'invited' | 'active' | 'inactive';
  joined_date?: string;
  last_active?: string;
  created_at: string;
  updated_at: string;
}

export interface InviteTeamMemberInput {
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'viewer';
}

export function useFriTeam(lessorId: string | null) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all team members
  const fetch = useCallback(async () => {
    if (!lessorId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('lessor_team_members')
        .select('*')
        .eq('lessor_id', lessorId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMembers(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(message);
      console.error('Error fetching team members:', err);
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

  // Invite a new team member
  const inviteMember = useCallback(
    async (input: InviteTeamMemberInput) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        // Check if member already exists
        const { data: existing, error: checkError } = await supabase
          .from('lessor_team_members')
          .select('id')
          .eq('lessor_id', lessorId)
          .eq('email', input.email)
          .single();

        if (!checkError && existing) {
          throw new Error('This email is already part of the team');
        }

        const { data, error: insertError } = await supabase
          .from('lessor_team_members')
          .insert({
            lessor_id: lessorId,
            email: input.email,
            full_name: input.full_name,
            role: input.role,
            status: 'invited',
          })
          .select();

        if (insertError) throw insertError;

        if (data && data[0]) {
          setMembers((prev) => [...prev, data[0]]);
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to invite member';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update member role
  const updateRole = useCallback(
    async (id: string, role: TeamMember['role']) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { data, error: updateError } = await supabase
          .from('lessor_team_members')
          .update({ role })
          .eq('id', id)
          .eq('lessor_id', lessorId)
          .select();

        if (updateError) throw updateError;

        if (data && data[0]) {
          setMembers((prev) =>
            prev.map((m) => (m.id === id ? data[0] : m))
          );
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update role';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update member status
  const updateStatus = useCallback(
    async (id: string, status: TeamMember['status']) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { data, error: updateError } = await supabase
          .from('lessor_team_members')
          .update({ status })
          .eq('id', id)
          .eq('lessor_id', lessorId)
          .select();

        if (updateError) throw updateError;

        if (data && data[0]) {
          setMembers((prev) =>
            prev.map((m) => (m.id === id ? data[0] : m))
          );
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update status';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Remove team member
  const removeMember = useCallback(
    async (id: string) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from('lessor_team_members')
          .delete()
          .eq('id', id)
          .eq('lessor_id', lessorId);

        if (deleteError) throw deleteError;

        setMembers((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove member';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Resend invitation
  const resendInvitation = useCallback(
    async (id: string) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        // Update status to invited
        const { data, error: updateError } = await supabase
          .from('lessor_team_members')
          .update({ status: 'invited' })
          .eq('id', id)
          .eq('lessor_id', lessorId)
          .select();

        if (updateError) throw updateError;

        if (data && data[0]) {
          setMembers((prev) =>
            prev.map((m) => (m.id === id ? data[0] : m))
          );
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to resend invitation';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Get role label
  const getRoleLabel = (role: TeamMember['role']): string => {
    const labels: Record<TeamMember['role'], string> = {
      owner: 'Ejer',
      admin: 'Administrator',
      manager: 'Manager',
      viewer: 'Læser',
    };
    return labels[role];
  };

  // Get role description
  const getRoleDescription = (role: TeamMember['role']): string => {
    const descriptions: Record<TeamMember['role'], string> = {
      owner: 'Fuld adgang og kan administrere andre medlemmer',
      admin: 'Fuld adgang til alle funktioner',
      manager: 'Kan administrere køretøjer, bookinger og fakturaer',
      viewer: 'Læseadgang til alle data',
    };
    return descriptions[role];
  };

  return {
    members,
    loading,
    error,
    refetch: fetch,
    inviteMember,
    updateRole,
    updateStatus,
    removeMember,
    resendInvitation,
    getRoleLabel,
    getRoleDescription,
  };
}
