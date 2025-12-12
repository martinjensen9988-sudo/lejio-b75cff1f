import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGpsDevices, GpsDeviceWithLatest } from '@/hooks/useGpsDevices';
import { useGeofences, useGeofenceAlerts } from '@/hooks/useGeofences';
import { useMessages } from '@/hooks/useMessages';
import Navigation from '@/components/Navigation';
import { GpsDeviceList } from '@/components/gps/GpsDeviceList';
import { GpsTrackingMap } from '@/components/gps/GpsTrackingMap';
import { GeofenceList } from '@/components/gps/GeofenceList';
import { GeofenceAlertsList } from '@/components/gps/GeofenceAlertsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, MapPin, Shield, Bell, Navigation as NavIcon, Smartphone, HelpCircle, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GpsTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { devices, isLoading } = useGpsDevices();
  const { geofences } = useGeofences();
  const { unreadCount } = useGeofenceAlerts();
  const { startConversation } = useMessages();
  const [selectedDevice, setSelectedDevice] = useState<GpsDeviceWithLatest | null>(null);
  const [startingChat, setStartingChat] = useState(false);

  const handleContactSupport = async () => {
    setStartingChat(true);
    try {
      const conversationId = await startConversation(user!.id, true);
      if (conversationId) {
        toast.success('Chat startet med support');
        navigate('/messages');
      }
    } catch (error) {
      toast.error('Kunne ikke starte chat');
    } finally {
      setStartingChat(false);
    }
  };

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

  const hasDevices = devices.length > 0;

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

        {!hasDevices ? (
          // Empty state - show simple getting started guide
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <NavIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Kom i gang med GPS-sporing</CardTitle>
                <CardDescription className="text-base">
                  Spor dine køretøjer i realtid og få besked når de forlader bestemte områder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">1. Køb en GPS-tracker</h3>
                      <p className="text-sm text-muted-foreground">
                        Vi anbefaler Teltonika eller Ruptela trackere. Kontakt os for vejledning.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">2. Kontakt LEJIO support</h3>
                      <p className="text-sm text-muted-foreground">
                        Send os tracker-modellen og IMEI-nummeret, så sætter vi det op for dig.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">3. Begynd at spore</h3>
                      <p className="text-sm text-muted-foreground">
                        Når vi har sat det op, kan du se dine køretøjer live på kortet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="flex-1" onClick={handleContactSupport} disabled={startingChat}>
                    {startingChat ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4 mr-2" />
                    )}
                    Kontakt support
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/faq')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Læs mere om GPS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Has devices - show tracking interface
          <Tabs defaultValue="tracking" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tracking" className="gap-2">
                <MapPin className="w-4 h-4" />
                Sporing
              </TabsTrigger>
              <TabsTrigger value="geofences" className="gap-2">
                <Shield className="w-4 h-4" />
                Zoner
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
                    showAddButton={false}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="geofences" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GeofenceList />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Hvad er en zone?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>
                      En zone (geofence) er et virtuelt område på kortet. Du får automatisk en alarm, når et køretøj forlader eller ankommer til zonen.
                    </p>
                    <p>
                      <strong>Eksempel:</strong> Opret en zone rundt om din adresse, så du får besked hvis bilen kører væk uden tilladelse.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <GeofenceAlertsList />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default GpsTracking;