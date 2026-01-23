import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FleetVehicleStats {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number | null;
  image_url: string | null;
  current_odometer: number | null;
  service_status: string | null;
  last_service_date: string | null;
  // Rental status
  currentStatus: 'rented' | 'available' | 'maintenance' | 'cleaning';
  currentBooking: {
    renter_name: string | null;
    start_date: string;
    end_date: string;
  } | null;
  // Economics
  monthlyRevenue: number;
  yearlyRevenue: number;
  commission: number;
  netPayout: number;
  // Installment (if applicable)
  activeInstallment: {
    monthlyAmount: number;
    remainingMonths: number;
    totalRemaining: number;
    description: string;
  } | null;
  // Guarantee tracking (300 days / 10 months)
  daysRentedThisYear: number;
  guaranteeDays: number;
  // Service history
  lastServiceLog: {
    service_type: string;
    service_date: string;
    description: string | null;
  } | null;
  // Cleanliness
  isClean: boolean;
  lastCleanedAt: string | null;
}

export interface FleetPremiumSummary {
  totalVehicles: number;
  totalMonthlyRevenue: number;
  totalYearlyRevenue: number;
  totalCommission: number;
  totalNetPayout: number;
  totalInstallments: number;
  averageUtilization: number;
  vehiclesMeetingGuarantee: number;
}

export const useFleetPremiumVehicles = () => {
  const { user, profile } = useAuth();
  const [vehicles, setVehicles] = useState<FleetVehicleStats[]>([]);
  const [summary, setSummary] = useState<FleetPremiumSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const GUARANTEE_DAYS = 300; // 10 months * 30 days
  const COMMISSION_RATE = 0.35; // 35% for Fleet Premium

  const fetchVehicleData = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setSummary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const yearStart = `${selectedYear}-01-01`;
      const yearEnd = `${selectedYear}-12-31`;
      const monthStart = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
      const monthEnd = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];

      // Fetch user's vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', user.id);

      if (vehiclesError) throw vehiclesError;

      // Fetch all bookings for these vehicles this year
      const vehicleIds = vehiclesData?.map(v => v.id) || [];
      
      const { data: yearlyBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .gte('start_date', yearStart)
        .lte('end_date', yearEnd)
        .in('status', ['completed', 'active']);

      if (bookingsError) throw bookingsError;

      // Fetch active bookings (current rentals)
      const today = new Date().toISOString().split('T')[0];
      const { data: activeBookings } = await supabase
        .from('bookings')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .lte('start_date', today)
        .gte('end_date', today)
        .eq('status', 'active');

      // Fetch service logs
      const { data: serviceLogs } = await supabase
        .from('vehicle_service_logs')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .order('service_date', { ascending: false });

      // Fetch installments (from revenue_loss_calculations as loan tracking)
      const { data: installments } = await supabase
        .from('revenue_loss_calculations')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .eq('status', 'claimed');

      // Process each vehicle
      const processedVehicles: FleetVehicleStats[] = (vehiclesData || []).map(vehicle => {
        // Calculate yearly revenue for this vehicle
        const vehicleYearlyBookings = (yearlyBookings || []).filter(b => b.vehicle_id === vehicle.id);
        const yearlyRevenue = vehicleYearlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
        
        // Calculate monthly revenue
        const vehicleMonthlyBookings = vehicleYearlyBookings.filter(b => {
          const startDate = new Date(b.start_date);
          return startDate.getMonth() + 1 === selectedMonth;
        });
        const monthlyRevenue = vehicleMonthlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
        
        const commission = monthlyRevenue * COMMISSION_RATE;
        const netPayout = monthlyRevenue - commission;

        // Calculate days rented this year
        const daysRentedThisYear = vehicleYearlyBookings.reduce((total, booking) => {
          const start = new Date(Math.max(new Date(booking.start_date).getTime(), new Date(yearStart).getTime()));
          const end = new Date(Math.min(new Date(booking.end_date).getTime(), new Date(yearEnd).getTime()));
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          return total + Math.max(0, days);
        }, 0);

        // Current rental status
        const activeBooking = (activeBookings || []).find(b => b.vehicle_id === vehicle.id);
        let currentStatus: 'rented' | 'available' | 'maintenance' | 'cleaning' = 'available';
        
        if (activeBooking) {
          currentStatus = 'rented';
        } else if (vehicle.service_status === 'service_required' || vehicle.service_status === 'blocked') {
          currentStatus = 'maintenance';
        }

        // Get last service log
        const vehicleServiceLogs = (serviceLogs || []).filter(s => s.vehicle_id === vehicle.id);
        const lastServiceLog = vehicleServiceLogs[0] || null;

        // Check for active installments (using total_revenue_loss / days to calculate monthly)
        const vehicleInstallment = (installments || []).find(i => i.vehicle_id === vehicle.id);
        let activeInstallment = null;
        if (vehicleInstallment) {
          const monthlyAmount = (vehicleInstallment.total_revenue_loss || 0) / 3; // Split over 3 months
          activeInstallment = {
            monthlyAmount: Math.round(monthlyAmount),
            remainingMonths: 3, // Default installment period
            totalRemaining: vehicleInstallment.total_revenue_loss || 0,
            description: 'Reparationsafdrag',
          };
        }

        return {
          id: vehicle.id,
          registration: vehicle.registration,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image_url: vehicle.image_url,
          current_odometer: vehicle.last_service_odometer,
          service_status: vehicle.service_status,
          last_service_date: vehicle.last_service_date,
          currentStatus,
          currentBooking: activeBooking ? {
            renter_name: activeBooking.renter_name || `${activeBooking.renter_first_name || ''} ${activeBooking.renter_last_name || ''}`.trim(),
            start_date: activeBooking.start_date,
            end_date: activeBooking.end_date,
          } : null,
          monthlyRevenue,
          yearlyRevenue,
          commission,
          netPayout,
          activeInstallment,
          daysRentedThisYear,
          guaranteeDays: GUARANTEE_DAYS,
          lastServiceLog: lastServiceLog ? {
            service_type: lastServiceLog.service_type,
            service_date: lastServiceLog.service_date,
            description: lastServiceLog.description,
          } : null,
          isClean: true, // Default to clean since we handle cleaning
          lastCleanedAt: null,
        };
      });

      setVehicles(processedVehicles);

      // Calculate summary
      const totalMonthlyRevenue = processedVehicles.reduce((sum, v) => sum + v.monthlyRevenue, 0);
      const totalYearlyRevenue = processedVehicles.reduce((sum, v) => sum + v.yearlyRevenue, 0);
      const totalCommission = processedVehicles.reduce((sum, v) => sum + v.commission, 0);
      const totalNetPayout = processedVehicles.reduce((sum, v) => sum + v.netPayout, 0);
      const totalInstallments = processedVehicles.reduce((sum, v) => sum + (v.activeInstallment?.monthlyAmount || 0), 0);
      const averageUtilization = processedVehicles.length > 0 
        ? (processedVehicles.reduce((sum, v) => sum + v.daysRentedThisYear, 0) / processedVehicles.length / GUARANTEE_DAYS) * 100
        : 0;
      const vehiclesMeetingGuarantee = processedVehicles.filter(v => v.daysRentedThisYear >= GUARANTEE_DAYS).length;

      setSummary({
        totalVehicles: processedVehicles.length,
        totalMonthlyRevenue,
        totalYearlyRevenue,
        totalCommission,
        totalNetPayout,
        totalInstallments,
        averageUtilization,
        vehiclesMeetingGuarantee,
      });

    } catch (error) {
      console.error('Error fetching fleet premium data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  return {
    vehicles,
    summary,
    isLoading,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    refetch: fetchVehicleData,
    GUARANTEE_DAYS,
    COMMISSION_RATE,
  };
};
