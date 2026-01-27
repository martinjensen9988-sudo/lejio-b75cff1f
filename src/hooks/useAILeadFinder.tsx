import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SalesLead } from './useSalesLeads';
import { toast } from 'sonner';

export interface LeadSuggestion {
  company_name: string;
  industry: string;
  city?: string;
  reason: string;
  score: number;
  search_query: string;
  source: 'ai_recommendation' | 'ai_discovery';
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  cvr?: string;
  enriched?: boolean;
  email_sent?: boolean;
  email_status?: string;
}

export interface AILeadFinderResponse {
  success: boolean;
  suggestions: LeadSuggestion[];
  mode: string;
  total: number;
  savedLeads?: number;
  enriched?: number;
  stats?: {
    with_email: number;
    with_phone: number;
    with_website: number;
    with_cvr: number;
  };
}

export const useAILeadFinder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LeadSuggestion[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const findSmartRecommendations = useCallback(async (existingLeads: SalesLead[], options?: {
    autoEnrich?: boolean;
    sendEmails?: boolean;
    batchSize?: number;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-find-leads', {
        body: { 
          mode: 'smart_recommendations',
          existingLeads,
          autoEnrich: options?.autoEnrich ?? true,
          sendEmails: options?.sendEmails ?? false,
          batchSize: options?.batchSize ?? 20,
          includeScoring: true,
          targetIndustries: [
            'biludlejning',
            'billeasing',
            'bilforhandler',
            'autoværksted',
            'autoudlejning'
          ]
        },
      });

      if (error) {
        console.error('AI find leads error:', error);
        toast.error('Kunne ikke hente AI-anbefalinger');
        return null;
      }

      setSuggestions(data.suggestions || []);
      setLastUpdated(new Date());
      
      // Show stats
      if (data.stats) {
        toast.success(`${data.enriched || 0} leads berigt med kontaktinfo`);
      }
      
      return data as AILeadFinderResponse;
    } catch (error) {
      console.error('AI find leads error:', error);
      toast.error('Der opstod en fejl');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const discoverNewLeads = useCallback(async (options?: {
    autoEnrich?: boolean;
    sendEmails?: boolean;
    batchSize?: number;
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-find-leads', {
        body: { 
          mode: 'discovery',
          autoEnrich: options?.autoEnrich ?? true,
          sendEmails: options?.sendEmails ?? false,
          batchSize: options?.batchSize ?? 20,
          includeScoring: true,
          targetIndustries: [
            'biludlejning',
            'billeasing',
            'bilforhandler',
            'autoværksted',
            'autoudlejning',
            'motorcykeludlejning',
            'taxiselskab',
            'transportfirma'
          ]
        },
      });

      if (error) {
        console.error('AI discovery error:', error);
        toast.error('Kunne ikke hente lead-forslag');
        return null;
      }

      setSuggestions(data.suggestions || []);
      setLastUpdated(new Date());
      
      // Show comprehensive stats
      if (data.stats) {
        const statMsg = `${data.suggestions?.length || 0} leads fundet. ${data.enriched || 0} med kontaktinfo (email: ${data.stats.with_email}, telefon: ${data.stats.with_phone})`;
        toast.success(statMsg);
      }
      
      return data as AILeadFinderResponse;
    } catch (error) {
      console.error('AI discovery error:', error);
      toast.error('Der opstod en fejl');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger automated lead discovery (runs daily via scheduler)
  const triggerAutomatedDiscovery = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-find-and-score-leads', {
        body: {}
      });

      if (error) {
        console.error('Automated discovery error:', error);
        toast.error('Kunne ikke starte automatisk lead-søgning');
        return null;
      }

      toast.success(`${data.added} nye leads fundet og tilføjet!`);
      setLastUpdated(new Date());
      return data;
    } catch (error) {
      console.error('Automated discovery error:', error);
      toast.error('Der opstod en fejl ved automatisk søgning');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setLastUpdated(null);
  }, []);

  return {
    isLoading,
    suggestions,
    lastUpdated,
    findSmartRecommendations,
    discoverNewLeads,
    triggerAutomatedDiscovery,
    clearSuggestions,
  };
};
