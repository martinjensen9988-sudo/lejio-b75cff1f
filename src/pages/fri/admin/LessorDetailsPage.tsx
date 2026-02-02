import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/azure/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, AlertTriangle, DollarSign, Zap, TrendingUp, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { da } from 'date-fns/locale';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LessorDetails {
  id: string;
  email: string;
  company_name: string;
  cvr_number: string;
  custom_domain: string;
  primary_color: string;
  logo_url: string;
  trial_start_date: string;
  trial_end_date: string;
  subscription_status: string;
  created_at: string;
}

interface LessorData {
  vehicles: number;
  bookings: number;
  revenue: number;
  activeBookings: number;
  completedBookings: number;
  monthlyData: any[];
}

export const FriAdminLessorDetailsPage = () => {
  const { lessorId } = useParams();
  const navigate = useNavigate();
  const [lessor, setLessor] = useState<LessorDetails | null>(null);
  const [data, setData] = useState<LessorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessorDetails = async () => {
      if (!lessorId) return;

      try {
        setLoading(true);

        // Fetch lessor info
        const { data: lessorData, error: lessorError } = await supabase
          .from('fri_lessors')
          .select('*')
          .eq('id', lessorId)
          .single();

        if (lessorError) throw lessorError;
        setLessor(lessorData);

        // Fetch lessor data
        const [vehiclesRes, bookingsRes, invoicesRes, activeBookingsRes] = await Promise.all([
          supabase.from('fri_vehicles').select('id').eq('lessor_id', lessorId),
          supabase.from('fri_bookings').select('id, total_price, status, start_date').eq('lessor_id', lessorId),
          supabase.from('fri_invoices').select('id').eq('lessor_id', lessorId),
          supabase.from('fri_bookings').select('id').eq('lessor_id', lessorId).eq('status', 'confirmed'),
        ]);

        const bookingsData = bookingsRes.data || [];
        const monthlyMap = new Map<string, number>();
        
        bookingsData.forEach(booking => {
          const month = new Date(booking.start_date).toLocaleDateString('da-DK', {
            year: 'numeric',
            month: 'short',
          });
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + (booking.total_price || 0));
        });

        setData({
          vehicles: vehiclesRes.data?.length || 0,
          bookings: bookingsData.length,
          revenue: bookingsData.reduce((sum, b) => sum + (b.total_price || 0), 0),
          activeBookings: activeBookingsRes.data?.length || 0,
          completedBookings: bookingsData.filter(b => b.status === 'completed').length,
          monthlyData: Array.from(monthlyMap.entries())
            .map(([month, revenue]) => ({ month, revenue }))
            .slice(-12),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Fejl ved indlæsning';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessorDetails();
  }, [lessorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Indlæser...</div>
      </div>
    );
  }

  if (error || !lessor || !data) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/fri/admin/lessors')}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbage til lessors
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || 'Lessor ikke fundet'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const trialDaysLeft = Math.ceil(
    (new Date(lessor.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusColor = {
    trial: 'text-blue-600',
    active: 'text-green-600',
    suspended: 'text-yellow-600',
    cancelled: 'text-red-600',
  }[lessor.subscription_status] || 'text-gray-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/fri/admin/lessors')}
            className="gap-2 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Tilbage til lessors
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{lessor.company_name}</h1>
          <p className={`text-lg font-medium mt-2 ${statusColor}`}>
            {lessor.subscription_status === 'trial'
              ? 'Prøveperiode'
              : lessor.subscription_status === 'active'
                ? 'Aktiv'
                : lessor.subscription_status === 'suspended'
                  ? 'Suspenderet'
                  : 'Annulleret'}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Biler</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.vehicles}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.bookings}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                kr. {(data.revenue / 1000).toFixed(1)}k
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Aktive</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.activeBookings}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Gennemf.</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{data.completedBookings}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontooplysninger</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{lessor.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CVR</span>
              <span className="font-medium text-gray-900">{lessor.cvr_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Oprettet</span>
              <span className="font-medium text-gray-900">
                {formatDistanceToNow(new Date(lessor.created_at), { locale: da, addSuffix: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Domæne</span>
              <span className="font-medium text-gray-900 text-right max-w-xs break-words">
                {lessor.custom_domain || 'Standard'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {lessor.subscription_status === 'trial' ? 'Prøveperiode' : 'Abonnement'}
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-gray-900 capitalize">
                {lessor.subscription_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start dato</span>
              <span className="font-medium text-gray-900">
                {new Date(lessor.trial_start_date).toLocaleDateString('da-DK')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Slut dato</span>
              <span className="font-medium text-gray-900">
                {new Date(lessor.trial_end_date).toLocaleDateString('da-DK')}
              </span>
            </div>
            {lessor.subscription_status === 'trial' && (
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Dage tilbage</span>
                <span className={`font-bold ${trialDaysLeft > 7 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.max(0, trialDaysLeft)} dage
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Månedlig revenue</h3>
        {data.monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `kr. ${value.toLocaleString('da-DK')}`} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-gray-500">
            Ingen data tilgængelig
          </div>
        )}
      </Card>
    </div>
  );
};
