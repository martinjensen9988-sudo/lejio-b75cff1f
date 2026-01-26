import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Type-safe real-time subscription management
export interface RealtimeSubscriptionConfig {
  tableName: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onData: (payload: any) => void;
  onError?: (error: Error) => void;
}

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const subscribeToChanges = () => {
      try {
        const newChannel = supabase
          .channel(`${config.tableName}:${config.event || '*'}`)
          .on(
            'postgres_changes',
            {
              event: config.event || '*',
              schema: 'public',
              table: config.tableName,
              ...(config.filter && { filter: config.filter }),
            },
            (payload) => {
              config.onData(payload);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsSubscribed(true);
            } else if (status === 'CLOSED') {
              setIsSubscribed(false);
            } else if (status === 'CHANNEL_ERROR') {
              config.onError?.(new Error('Real-time subscription error'));
              setIsSubscribed(false);
            }
          });

        setChannel(newChannel);
      } catch (error) {
        config.onError?.(error instanceof Error ? error : new Error('Subscription error'));
      }
    };

    subscribeToChanges();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [config, channel]);

  return { isSubscribed };
};

// Real-time invoice updates hook
export const useRealtimeInvoices = (userId: string | undefined, onUpdate: (payload: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`invoices:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `lessor_id=eq.${userId}`,
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onUpdate]);

  return { isConnected };
};

// Real-time payment reminders hook
export const useRealtimePaymentReminders = (onUpdate: (payload: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('payment_reminders:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_reminders',
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);

  return { isConnected };
};

// Real-time subscriptions hook
export const useRealtimeSubscriptions = (userId: string | undefined, onUpdate: (payload: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`subscriptions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `renter_id=eq.${userId}`,
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onUpdate]);

  return { isConnected };
};

// Broadcast message hook for pub/sub communication
export const useBroadcast = (channelName: string, onMessage?: (data: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback(
    (data: any) => {
      const channel = supabase.channel(channelName);
      channel.send({
        type: 'broadcast',
        event: 'message',
        payload: data,
      });
    },
    [channelName]
  );

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'message' }, (payload) => {
        onMessage?.(payload.payload);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, onMessage]);

  return { isConnected, sendMessage };
};
