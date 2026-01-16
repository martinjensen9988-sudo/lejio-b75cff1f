import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminCheckInOutSettings } from '@/components/admin/AdminCheckInOutSettings';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Loader2 } from 'lucide-react';

const AdminCheckInOutPage = () => {
  const navigate = useNavigate();
  const { user, hasAccess, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && (!user || !hasAccess)) {
      navigate('/admin');
    }
  }, [user, hasAccess, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminDashboardLayout activeTab="checkinout">
      <div>
        <h2 className="text-2xl font-bold mb-2">Check-in/out</h2>
        <p className="text-muted-foreground mb-6">Indstillinger for check-in/out</p>
        <AdminCheckInOutSettings />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminCheckInOutPage;
