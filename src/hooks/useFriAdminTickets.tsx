import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/azure/client';

export interface Ticket {
  id: string;
  lessor_id: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  lessor_name?: string;
  lessor_email?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'lessor' | 'admin';
  message: string;
  created_at: string;
  sender_name?: string;
}

interface UseFriAdminTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  fetchTickets: (filter?: string) => Promise<void>;
  getTicket: (ticketId: string) => Promise<Ticket | null>;
  getTicketMessages: (ticketId: string) => Promise<TicketMessage[]>;
  replyToTicket: (ticketId: string, message: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
  updateTicketPriority: (ticketId: string, priority: Ticket['priority']) => Promise<void>;
}

export const useFriAdminTickets = (): UseFriAdminTicketsReturn => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async (filter?: string) => {
    try {
      setError(null);
      setLoading(true);

      let query = supabase
        .from('fri_support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: err } = await query;

      if (err) throw new Error(err.message);
      setTickets(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved indlæsning af tickets';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getTicket = async (ticketId: string): Promise<Ticket | null> => {
    try {
      const { data, error: err } = await supabase
        .from('fri_support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (err) throw new Error(err.message);
      return data;
    } catch (err) {
      console.error('Error fetching ticket:', err);
      return null;
    }
  };

  const getTicketMessages = async (ticketId: string): Promise<TicketMessage[]> => {
    try {
      const { data, error: err } = await supabase
        .from('fri_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (err) throw new Error(err.message);
      return data || [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  };

  const replyToTicket = async (ticketId: string, message: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: 'admin', // In real app, use actual admin ID from auth
          sender_type: 'admin',
          message,
        });

      if (err) throw new Error(err.message);

      // Update ticket updated_at
      await supabase
        .from('fri_support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved afsendelse';
      setError(message);
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    try {
      const { error: err } = await supabase
        .from('fri_support_tickets')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (err) throw new Error(err.message);

      setTickets(tickets.map(t =>
        t.id === ticketId ? { ...t, status, updated_at: new Date().toISOString() } : t
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved opdatering';
      setError(message);
      throw err;
    }
  };

  const updateTicketPriority = async (ticketId: string, priority: Ticket['priority']) => {
    try {
      const { error: err } = await supabase
        .from('fri_support_tickets')
        .update({
          priority,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (err) throw new Error(err.message);

      setTickets(tickets.map(t =>
        t.id === ticketId ? { ...t, priority, updated_at: new Date().toISOString() } : t
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved opdatering';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    getTicket,
    getTicketMessages,
    replyToTicket,
    updateTicketStatus,
    updateTicketPriority,
  };
};
