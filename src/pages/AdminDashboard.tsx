
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Clock, Calendar, Sparkles, BarChart3, MessageCircle, Flag, AlertTriangle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
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

  // Dashboard overview content
  return (
    <AdminDashboardLayout activeTab="overview">
      <div className="pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Velkommen til Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Få et hurtigt overblik over platformens aktivitet og status.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" />
              <div>
                <p className="text-2xl font-bold">Kunder</p>
                <p className="text-xs text-muted-foreground">Total antal registrerede</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-mint/10 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-accent" />
              <div>
                <p className="text-2xl font-bold">Aktive</p>
                <p className="text-xs text-muted-foreground">Aktive kunder</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-mint/10 to-lavender/10 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-mint" />
              <div>
                <p className="text-2xl font-bold">Prøve</p>
                <p className="text-xs text-muted-foreground">Kunder på prøveperiode</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-lavender/10 to-primary/10 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <Calendar className="w-10 h-10 text-lavender" />
              <div>
                <p className="text-2xl font-bold">Bookinger</p>
                <p className="text-xs text-muted-foreground">Total antal bookinger</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/80 border-0 shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-bold">Statistik</h2>
              <Badge variant="secondary" className="ml-2">Live</Badge>
            </div>
            <p className="text-muted-foreground">Se detaljeret statistik for platformen.</p>
            <button className="mt-4 btn btn-primary" onClick={() => navigate('/admin/stats')}>Gå til statistik</button>
          </Card>
          <Card className="p-6 bg-card/80 border-0 shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <Sparkles className="w-8 h-8 text-accent" />
              <h2 className="text-xl font-bold">Feature Flags</h2>
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            </div>
            <p className="text-muted-foreground">Administrer funktioner og moduler for kunder.</p>
            <button className="mt-4 btn btn-accent" onClick={() => navigate('/admin/feature-flags')}>Administrer features</button>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Card className="p-6 bg-card/80 border-0 shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-bold">Beskeder</h2>
            </div>
            <p className="text-muted-foreground">Se og administrer beskeder fra brugere.</p>
            <button className="mt-4 btn btn-primary" onClick={() => navigate('/admin/messages')}>Gå til beskeder</button>
          </Card>
          <Card className="p-6 bg-card/80 border-0 shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <Flag className="w-8 h-8 text-accent" />
              <h2 className="text-xl font-bold">Rapporter</h2>
            </div>
            <p className="text-muted-foreground">Se rapporter og advarsler.</p>
            <button className="mt-4 btn btn-accent" onClick={() => navigate('/admin/reports')}>Gå til rapporter</button>
          </Card>
        </div>
        <div className="mt-10">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-lg">
            <div className="flex items-center gap-4 mb-2">
              <AlertTriangle className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-bold">Advarsler</h2>
            </div>
            <p className="text-muted-foreground">Oversigt over advarsler og risici.</p>
            <button className="mt-4 btn btn-primary" onClick={() => navigate('/admin/warnings')}>Gå til advarsler</button>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
