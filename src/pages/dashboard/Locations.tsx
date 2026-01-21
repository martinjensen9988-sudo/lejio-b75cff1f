import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DealerLocationsManager } from "@/components/dealer/DealerLocationsManager";
import { useAuth } from "@/hooks/useAuth";

const LocationsPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout activeTab="locations">
      <div>
        <h2 className="text-2xl font-bold mb-2">Mine lokationer</h2>
        <p className="text-muted-foreground mb-6">
          Administrer dine udlejningslokationer, åbningstider og forberedelsestid
        </p>
        {user?.id && <DealerLocationsManager partnerId={user.id} />}
      </div>
    </DashboardLayout>
  );
};

export default LocationsPage;
