import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCommissionRate, FleetVehicleStats, FleetPremiumSummary } from './useFleetPremiumVehicles';

export interface FleetCustomerWithVehicles {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  fleet_plan: string | null;
  fleet_commission_rate: number | null;
  vehicles: FleetVehicleStats[];
  summary: FleetPremiumSummary;
}

export const useAdminFleetPremiumVehicles = () => {
  const [customers, setCustomers] = useState<FleetCustomerWithVehicles[]>([]);
  const [allVehicles, setAllVehicles] = useState<FleetVehicleStats[]>([]);
  const [globalSummary, setGlobalSummary] = useState<FleetPremiumSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const GUARANTEE_DAYS = 300;

  const fetchAllFleetData = useCallback(async () => {
    setIsLoading(true);
    try {
      const yearStart = `${selectedYear}-01-01`;
      const yearEnd = `${selectedYear}-12-31`;
      const today = new Date().toISOString().split('T')[0];

      // Fetch all fleet customers (users with fleet_plan set)
      const { data: fleetProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .not('fleet_plan', 'is', null);

      if (profilesError) throw profilesError;

      const fleetOwnerIds = (fleetProfiles || []).map(p => p.id);

      if (fleetOwnerIds.length === 0) {
        setCustomers([]);
        setAllVehicles([]);
        setGlobalSummary(null);
        setIsLoading(false);
        return;
      }

      // Fetch all vehicles for fleet customers
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .in('owner_id', fleetOwnerIds);

      if (vehiclesError) throw vehiclesError;

      const vehicleIds = (vehiclesData || []).map(v => v.id);

      // Fetch supporting data in parallel
      const [
        loansResult,
        loanPaymentsResult,
        tireSetsResult,
        gpsDevicesResult,
        serviceLogsResult,
        yearlyBookingsResult,
        activeBookingsResult,
      ] = await Promise.all([
        supabase.from('fleet_vehicle_loans').select('*').in('lessor_id', fleetOwnerIds).eq('status', 'active'),
        supabase.from('fleet_loan_payments').select('*'),
        vehicleIds.length > 0 ? supabase.from('tire_sets').select('*').in('vehicle_id', vehicleIds) : { data: [] },
        vehicleIds.length > 0 ? supabase.from('gps_devices').select('*').in('vehicle_id', vehicleIds).eq('is_active', true) : { data: [] },
        vehicleIds.length > 0 ? supabase.from('vehicle_service_logs').select('*').in('vehicle_id', vehicleIds).order('service_date', { ascending: false }) : { data: [] },
        vehicleIds.length > 0 ? supabase.from('bookings').select('*').in('vehicle_id', vehicleIds).gte('start_date', yearStart).lte('end_date', yearEnd).in('status', ['completed', 'active']) : { data: [] },
        vehicleIds.length > 0 ? supabase.from('bookings').select('*').in('vehicle_id', vehicleIds).lte('start_date', today).gte('end_date', today).eq('status', 'active') : { data: [] },
      ]);

      const loansData = loansResult.data || [];
      const loanPaymentsData = loanPaymentsResult.data || [];
      const tireSetsData = tireSetsResult.data || [];
      const gpsDevicesData = gpsDevicesResult.data || [];
      const serviceLogsData = serviceLogsResult.data || [];
      const yearlyBookings = yearlyBookingsResult.data || [];
      const activeBookings = activeBookingsResult.data || [];

      // Fetch GPS locations
      const deviceIds = gpsDevicesData.map(d => d.id);
      let gpsLocations: any[] = [];
      if (deviceIds.length > 0) {
        const { data: gpsData } = await supabase
          .from('gps_data_points')
          .select('*')
          .in('device_id', deviceIds)
          .order('recorded_at', { ascending: false })
          .limit(vehicleIds.length);
        gpsLocations = gpsData || [];
      }

      // Process each customer
      const processedCustomers: FleetCustomerWithVehicles[] = [];
      const allProcessedVehicles: FleetVehicleStats[] = [];

      for (const profile of fleetProfiles || []) {
        const customerVehicles = (vehiclesData || []).filter(v => v.owner_id === profile.id);
        const commissionRate = profile.fleet_commission_rate 
          ? profile.fleet_commission_rate / 100 
          : getCommissionRate(customerVehicles.length);

        const processedVehicles: FleetVehicleStats[] = customerVehicles.map(vehicle => {
          const vehicleYearlyBookings = yearlyBookings.filter(b => b.vehicle_id === vehicle.id);
          const yearlyGrossRevenue = vehicleYearlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

          const vehicleMonthlyBookings = vehicleYearlyBookings.filter(b => {
            const startDate = new Date(b.start_date);
            return startDate.getMonth() + 1 === selectedMonth;
          });
          const monthlyGrossRevenue = vehicleMonthlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

          const lejioCommissionAmount = monthlyGrossRevenue * commissionRate;

          const vehicleLoans = loansData.filter(l => l.vehicle_id === vehicle.id);
          const activeLoan = vehicleLoans[0] || null;
          const totalLoanBalance = vehicleLoans.reduce((sum, l) => sum + (l.remaining_balance || 0), 0);
          const monthlyInstallment = vehicleLoans.reduce((sum, l) => sum + (l.monthly_installment || 0), 0);

          const loanIds = vehicleLoans.map(l => l.id);
          const loanPaymentHistory = loanPaymentsData.filter(p => loanIds.includes(p.loan_id));

          const netPayout = monthlyGrossRevenue - lejioCommissionAmount - monthlyInstallment;

          const daysRentedThisYear = vehicleYearlyBookings.reduce((total, booking) => {
            const start = new Date(Math.max(new Date(booking.start_date).getTime(), new Date(yearStart).getTime()));
            const end = new Date(Math.min(new Date(booking.end_date).getTime(), new Date(yearEnd).getTime()));
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return total + Math.max(0, days);
          }, 0);

          const daysAvailableThisYear = vehicle.days_available_this_year ||
            Math.min(365, Math.ceil((new Date().getTime() - new Date(yearStart).getTime()) / (1000 * 60 * 60 * 24)));

          const activeBooking = activeBookings.find(b => b.vehicle_id === vehicle.id);
          let currentStatus: 'rented' | 'available' | 'maintenance' | 'cleaning' = 'available';

          if (activeBooking) {
            currentStatus = 'rented';
          } else if (vehicle.service_status === 'service_required' || vehicle.service_status === 'blocked') {
            currentStatus = 'maintenance';
          }

          const gpsDevice = gpsDevicesData.find(d => d.vehicle_id === vehicle.id);
          let location = null;
          if (gpsDevice) {
            const latestPoint = gpsLocations.find(p => p.device_id === gpsDevice.id);
            if (latestPoint) {
              location = {
                latitude: latestPoint.latitude,
                longitude: latestPoint.longitude,
                last_updated: latestPoint.recorded_at,
              };
            }
          }

          const vehicleTires = tireSetsData.filter(t => t.vehicle_id === vehicle.id);
          const mountedTire = vehicleTires.find(t => t.is_mounted);
          const tireStatus = mountedTire ? {
            id: mountedTire.id,
            tire_type: mountedTire.tire_type as 'summer' | 'winter' | 'all_season',
            brand: mountedTire.brand,
            tread_depth_mm: mountedTire.tread_depth_mm,
            storage_location: mountedTire.storage_location,
            is_mounted: mountedTire.is_mounted,
          } : null;

          const vehicleServiceLogs = serviceLogsData.filter(s => s.vehicle_id === vehicle.id);
          const lastServiceLog = vehicleServiceLogs[0] || null;

          const guaranteePercentage = Math.min((daysRentedThisYear / GUARANTEE_DAYS) * 100, 100);
          const isGuaranteeMet = daysRentedThisYear >= GUARANTEE_DAYS;

          return {
            id: vehicle.id,
            registration: vehicle.registration,
            make: vehicle.make,
            model: vehicle.model,
            variant: vehicle.variant,
            year: vehicle.year,
            image_url: vehicle.image_url,
            current_odometer: vehicle.last_service_odometer || vehicle.current_odometer,
            vin: vehicle.vin,
            monthlyGrossRevenue,
            yearlyGrossRevenue,
            commissionRate,
            lejioCommissionAmount,
            cleaningFees: 0,
            netPayout,
            activeLoan: activeLoan ? {
              id: activeLoan.id,
              vehicle_id: activeLoan.vehicle_id,
              description: activeLoan.description,
              original_amount: activeLoan.original_amount,
              remaining_balance: activeLoan.remaining_balance,
              monthly_installment: activeLoan.monthly_installment,
              setup_fee: activeLoan.setup_fee || 300,
              remaining_months: activeLoan.remaining_months,
              start_date: activeLoan.start_date,
              status: activeLoan.status as 'active' | 'paid_off' | 'cancelled',
            } : null,
            totalLoanBalance,
            monthlyInstallment,
            loanPaymentHistory: loanPaymentHistory.map(p => ({
              id: p.id,
              loan_id: p.loan_id,
              payment_date: p.payment_date,
              amount: p.amount,
              payment_type: p.payment_type as 'installment' | 'setup_fee' | 'extra_payment',
              notes: p.notes,
            })),
            currentStatus,
            currentBooking: activeBooking ? {
              renter_name: activeBooking.renter_name || `${activeBooking.renter_first_name || ''} ${activeBooking.renter_last_name || ''}`.trim(),
              start_date: activeBooking.start_date,
              end_date: activeBooking.end_date,
            } : null,
            location,
            nextServiceDate: vehicle.last_service_date
              ? new Date(new Date(vehicle.last_service_date).setMonth(new Date(vehicle.last_service_date).getMonth() + (vehicle.service_interval_months || 12))).toISOString().split('T')[0]
              : null,
            nextServiceKm: vehicle.last_service_odometer ? vehicle.last_service_odometer + (vehicle.service_interval_km || 15000) : null,
            tireStatus,
            lastServiceLog: lastServiceLog ? {
              service_type: lastServiceLog.service_type,
              service_date: lastServiceLog.service_date,
              description: lastServiceLog.description,
              cost: lastServiceLog.cost,
            } : null,
            daysRentedThisYear,
            daysAvailableThisYear,
            guaranteeDays: GUARANTEE_DAYS,
            guaranteePercentage,
            isGuaranteeMet,
            isClean: true,
            service_status: vehicle.service_status,
          };
        });

        allProcessedVehicles.push(...processedVehicles);

        const totalMonthlyGrossRevenue = processedVehicles.reduce((sum, v) => sum + v.monthlyGrossRevenue, 0);
        const totalYearlyGrossRevenue = processedVehicles.reduce((sum, v) => sum + v.yearlyGrossRevenue, 0);
        const totalCommission = processedVehicles.reduce((sum, v) => sum + v.lejioCommissionAmount, 0);
        const totalMonthlyInstallments = processedVehicles.reduce((sum, v) => sum + v.monthlyInstallment, 0);
        const totalLoanBalance = processedVehicles.reduce((sum, v) => sum + v.totalLoanBalance, 0);
        const finalNetPayout = processedVehicles.reduce((sum, v) => sum + v.netPayout, 0);
        const averageUtilization = processedVehicles.length > 0
          ? (processedVehicles.reduce((sum, v) => sum + v.guaranteePercentage, 0) / processedVehicles.length)
          : 0;
        const vehiclesMeetingGuarantee = processedVehicles.filter(v => v.isGuaranteeMet).length;

        processedCustomers.push({
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name,
          company_name: profile.company_name,
          fleet_plan: profile.fleet_plan,
          fleet_commission_rate: profile.fleet_commission_rate,
          vehicles: processedVehicles,
          summary: {
            totalVehicles: processedVehicles.length,
            totalMonthlyGrossRevenue,
            totalYearlyGrossRevenue,
            totalCommission,
            totalCleaningFees: 0,
            totalMonthlyInstallments,
            totalLoanBalance,
            finalNetPayout,
            averageUtilization,
            vehiclesMeetingGuarantee,
          },
        });
      }

      setCustomers(processedCustomers);
      setAllVehicles(allProcessedVehicles);

      // Calculate global summary
      const globalTotalMonthlyGross = allProcessedVehicles.reduce((sum, v) => sum + v.monthlyGrossRevenue, 0);
      const globalTotalYearlyGross = allProcessedVehicles.reduce((sum, v) => sum + v.yearlyGrossRevenue, 0);
      const globalTotalCommission = allProcessedVehicles.reduce((sum, v) => sum + v.lejioCommissionAmount, 0);
      const globalTotalInstallments = allProcessedVehicles.reduce((sum, v) => sum + v.monthlyInstallment, 0);
      const globalTotalLoanBalance = allProcessedVehicles.reduce((sum, v) => sum + v.totalLoanBalance, 0);
      const globalFinalNetPayout = allProcessedVehicles.reduce((sum, v) => sum + v.netPayout, 0);
      const globalAverageUtilization = allProcessedVehicles.length > 0
        ? (allProcessedVehicles.reduce((sum, v) => sum + v.guaranteePercentage, 0) / allProcessedVehicles.length)
        : 0;
      const globalVehiclesMeetingGuarantee = allProcessedVehicles.filter(v => v.isGuaranteeMet).length;

      setGlobalSummary({
        totalVehicles: allProcessedVehicles.length,
        totalMonthlyGrossRevenue: globalTotalMonthlyGross,
        totalYearlyGrossRevenue: globalTotalYearlyGross,
        totalCommission: globalTotalCommission,
        totalCleaningFees: 0,
        totalMonthlyInstallments: globalTotalInstallments,
        totalLoanBalance: globalTotalLoanBalance,
        finalNetPayout: globalFinalNetPayout,
        averageUtilization: globalAverageUtilization,
        vehiclesMeetingGuarantee: globalVehiclesMeetingGuarantee,
      });

    } catch (error) {
      console.error('Error fetching admin fleet data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchAllFleetData();
  }, [fetchAllFleetData]);

  return {
    customers,
    allVehicles,
    globalSummary,
    isLoading,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    refetch: fetchAllFleetData,
    GUARANTEE_DAYS,
  };
};
