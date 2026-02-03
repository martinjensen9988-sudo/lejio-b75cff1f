import { useFriAuthContext } from '@/providers/FriAuthProvider';
import { useBrand } from '@/providers/BrandContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useFriStats } from '@/hooks/useFriData';
import { Loader2 } from 'lucide-react';

export function FriDashboard() {
  const { user, signOut, loading, error } = useFriAuthContext();
  const { companyName } = useBrand();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useFriStats();

  const handlePageBuilder = () => navigate('/dashboard/pages');
  const handleLogout = async () => {
    await signOut();
    navigate('/fri');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loader...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Fejl: {error.message}</p>
          <Button onClick={() => navigate('/fri/login')}>
            Gå til login
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Du skal være logget ind for at se dashboardet</p>
          <Button onClick={() => navigate('/fri/login')}>
            Gå til login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hej, {user.email}</span>
            <Button variant="outline" size="sm" onClick={handlePageBuilder}>
              📄 Lav Hjemmeside
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log ud
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Oversigt</TabsTrigger>
            <TabsTrigger value="vehicles">Køretøjer</TabsTrigger>
            <TabsTrigger value="bookings">Bookinger</TabsTrigger>
            <TabsTrigger value="invoices">Invoicer</TabsTrigger>
            <TabsTrigger value="analytics">Analytik</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="settings">Indstillinger</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard oversigt</h2>
              <p className="text-gray-600">
                Velkommen til dit Lejio Fri dashboard! Her kan du administrere hele din bilutlejningsvirksomhed.
              </p>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Aktive køretøjer</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statsLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{stats?.activeVehicles || 0}</p>
                    )}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Bookinger denne måned</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statsLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                    ) : (
                      <p className="text-2xl font-bold text-green-600">{stats?.bookingsThisMonth || 0}</p>
                    )}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Indlæg denne måned</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statsLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    ) : (
                      <p className="text-2xl font-bold text-purple-600">kr. {(stats?.revenueThisMonth || 0).toLocaleString('da-DK')}</p>
                    )}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Udestående invoicer</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statsLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                    ) : (
                      <p className="text-2xl font-bold text-orange-600">kr. {(stats?.outstandingInvoices || 0).toLocaleString('da-DK')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Køretøjer kommer snart...</p>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Bookinger kommer snart...</p>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Fakturaer</h2>
              <p className="text-gray-600 mb-6">Se og administrer alle dine fakturaer her. Track betalingsstatus, generer rapporter og download PDF.</p>
              <Button 
                size="lg"
                onClick={() => navigate('/fri/dashboard/invoices')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📋 Se Fakturaer
              </Button>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Analytik & Omsætning</h2>
              <p className="text-gray-600 mb-6">Få indsigt i din virksomheds performance. Se omsætning, udnyttelsesgrader og trends for hver køretøj.</p>
              <Button 
                size="lg"
                onClick={() => navigate('/fri/dashboard/analytics')}
                className="bg-green-600 hover:bg-green-700"
              >
                📊 Se Analytik
              </Button>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Teammedlemmer</h2>
              <p className="text-gray-600 mb-6">Administrer dine teammedlemmer. Tilføj medarbejdere, sæt roller (manager, chauffør, mekaniker) og styrer adgang.</p>
              <Button 
                size="lg"
                onClick={() => navigate('/fri/dashboard/team')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                👥 Se Team
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Indstillinger kommer snart...</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
