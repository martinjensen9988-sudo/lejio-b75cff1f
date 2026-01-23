import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface AuditLogEntry {
  action_type: 'create' | 'update' | 'delete' | 'view' | 'swap' | 'approve' | 'reject' | 'send' | 'login';
  entity_type: string;
  entity_id?: string;
  entity_identifier?: string;
  old_values?: Json;
  new_values?: Json;
  description: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = useCallback(async (entry: AuditLogEntry) => {
    if (!user) {
      console.warn('Cannot log audit action: user not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_audit_logs')
        .insert([{
          admin_user_id: user.id,
          action_type: entry.action_type,
          entity_type: entry.entity_type,
          entity_id: entry.entity_id || null,
          entity_identifier: entry.entity_identifier || null,
          old_values: entry.old_values || null,
          new_values: entry.new_values || null,
          description: entry.description,
          user_agent: navigator.userAgent,
        }]);

      if (error) {
        console.error('Failed to create audit log:', error);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }
  }, [user]);

  // Convenience methods for common actions
  const logCreate = useCallback((entityType: string, entityId: string, identifier: string, description: string, newValues?: Json) => {
    return logAction({
      action_type: 'create',
      entity_type: entityType,
      entity_id: entityId,
      entity_identifier: identifier,
      new_values: newValues,
      description,
    });
  }, [logAction]);

  const logUpdate = useCallback((entityType: string, entityId: string, identifier: string, description: string, oldValues?: Json, newValues?: Json) => {
    return logAction({
      action_type: 'update',
      entity_type: entityType,
      entity_id: entityId,
      entity_identifier: identifier,
      old_values: oldValues,
      new_values: newValues,
      description,
    });
  }, [logAction]);

  const logDelete = useCallback((entityType: string, entityId: string, identifier: string, description: string, oldValues?: Json) => {
    return logAction({
      action_type: 'delete',
      entity_type: entityType,
      entity_id: entityId,
      entity_identifier: identifier,
      old_values: oldValues,
      description,
    });
  }, [logAction]);

  const logSwap = useCallback((bookingId: string, description: string, details: Json) => {
    return logAction({
      action_type: 'swap',
      entity_type: 'vehicle_swap',
      entity_id: bookingId,
      new_values: details,
      description,
    });
  }, [logAction]);

  return {
    logAction,
    logCreate,
    logUpdate,
    logDelete,
    logSwap,
  };
};
