import { useFriAuthContext } from '@/providers/FriAuthProvider';
import { useBrand } from '@/providers/BrandContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { FriVehicleList } from '@/components/fri/FriVehicleList';
import { FriBookingList } from '@/components/fri/FriBookingList';
import { FriInvoiceList } from '@/components/fri/FriInvoiceList';
import { FriAnalyticsDashboard } from '@/components/fri/FriAnalyticsDashboard';

export function FriDashboard() {
  const { user, signOut } = useFriAuthContext();
  const { companyName } = useBrand();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/fri');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loader...</p>
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
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Bookinger denne måned</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Indlæg denne måned</p>
                  <p className="text-2xl font-bold text-purple-600">kr. 0</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Udestående invoicer</p>
                  <p className="text-2xl font-bold text-orange-600">kr. 0</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <div className="bg-white rounded-lg shadow p-6">
              <FriVehicleList lessorId={user?.id || null} />
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-lg shadow p-6">
              <FriBookingList lessorId={user?.id || null} />
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <div className="bg-white rounded-lg shadow p-6">
              <FriInvoiceList lessorId={user?.id || null} />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <FriAnalyticsDashboard lessorId={user?.id || null} />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Teammedlemmer</h2>
                <Button>Inviter medlem</Button>
              </div>
              <p className="text-gray-600">
                Du er den eneste medlem for øjeblikket.
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Indstillinger</h2>
              <p className="text-gray-600">
                Indstillinger kommer snart.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
