import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGpsDevices, GpsDeviceWithLatest } from '@/hooks/useGpsDevices';
import { useGeofences, useGeofenceAlerts } from '@/hooks/useGeofences';
import Navigation from '@/components/Navigation';
import { GpsDeviceList } from '@/components/gps/GpsDeviceList';
import { GpsTrackingMap } from '@/components/gps/GpsTrackingMap';
import { GpsWebhookInfo } from '@/components/gps/GpsWebhookInfo';
import { GeofenceList } from '@/components/gps/GeofenceList';
import { GeofenceAlertsList } from '@/components/gps/GeofenceAlertsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Settings, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GpsTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { devices, isLoading } = useGpsDevices();
  const { geofences } = useGeofences();
  const { unreadCount } = useGeofenceAlerts();
  const [selectedDevice, setSelectedDevice] = useState<GpsDeviceWithLatest | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">GPS-sporing</h1>
            <p className="text-muted-foreground">Spor dine køretøjer i realtid</p>
          </div>
        </div>

        <Tabs defaultValue="tracking" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tracking" className="gap-2">
              <MapPin className="w-4 h-4" />
              Sporing
            </TabsTrigger>
            <TabsTrigger value="geofences" className="gap-2">
              <Shield className="w-4 h-4" />
              Geofences
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              Alarmer
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Indstillinger
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GpsTrackingMap
                  devices={devices}
                  selectedDevice={selectedDevice}
                  onSelectDevice={setSelectedDevice}
                  geofences={geofences}
                />
              </div>
              <div>
                <GpsDeviceList
                  onSelectDevice={setSelectedDevice}
                  selectedDeviceId={selectedDevice?.id}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geofences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeofenceList />
              <GeofenceAlertsList />
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <GeofenceAlertsList />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GpsDeviceList />
              <GpsWebhookInfo />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GpsTracking;
