import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminFleetManagement from '@/components/admin/AdminFleetManagement';
import { AdminFleetPremiumDashboard } from '@/components/admin/AdminFleetPremiumDashboard';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BarChart3, Settings } from 'lucide-react';

const AdminFleetPage = () => {
  const navigate = useNavigate();
  const { user, hasAccess, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <AdminDashboardLayout activeTab="fleet">
      <div>
        <h2 className="text-2xl font-bold mb-2">Fleet Management</h2>
        <p className="text-muted-foreground mb-6">Oversigt over alle fleet-kunder og deres køretøjer</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminFleetPremiumDashboard />
          </TabsContent>

          <TabsContent value="management">
            <AdminFleetManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminFleetPage;
