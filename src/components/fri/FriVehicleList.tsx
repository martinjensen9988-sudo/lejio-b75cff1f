import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useFriVehicles, Vehicle, CreateVehicleInput } from '@/hooks/useFriVehicles';
import { FriVehicleForm } from './FriVehicleForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FriVehicleListProps {
  lessorId: string | null;
}

export function FriVehicleList({ lessorId }: FriVehicleListProps) {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle, updateStatus } =
    useFriVehicles(lessorId);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddVehicle = async (data: CreateVehicleInput) => {
    try {
      setError(null);
      await addVehicle(data);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding vehicle');
    }
  };

  const handleUpdateVehicle = async (data: CreateVehicleInput) => {
    try {
      setError(null);
      if (!editingVehicle) return;
      await updateVehicle(editingVehicle.id, data);
      setEditingVehicle(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      setError(null);
      await deleteVehicle(id);
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting vehicle');
    }
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
  };

  if (showForm || editingVehicle) {
    return (
      <FriVehicleForm
        vehicle={editingVehicle}
        onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
        onCancel={() => {
          setShowForm(false);
          setEditingVehicle(null);
        }}
      />
    );
  }

  if (loading) {
    return <div className="text-center py-8">Indlæser køretøjer...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mine køretøjer</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Tilføj køretøj
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">Ingen køretøjer endnu</p>
          <Button onClick={() => setShowForm(true)}>Tilføj dit første køretøj</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  {vehicle.year && (
                    <span className="text-gray-600 text-sm">{vehicle.year}</span>
                  )}
                  <Badge className={statusColors[vehicle.availability_status]}>
                    {vehicle.availability_status === 'available'
                      ? 'Ledig'
                      : vehicle.availability_status === 'rented'
                      ? 'Udlejet'
                      : vehicle.availability_status === 'maintenance'
                      ? 'Vedligehold'
                      : 'Udgået'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="text-gray-500">Nummerplade</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {vehicle.license_plate}
                    </p>
                  </div>
                  {vehicle.vin && (
                    <div>
                      <p className="text-gray-500">VIN</p>
                      <p className="font-mono text-sm">{vehicle.vin}</p>
                    </div>
                  )}
                  {vehicle.daily_rate && (
                    <div>
                      <p className="text-gray-500">Dagpris</p>
                      <p className="font-semibold text-gray-900">
                        kr. {vehicle.daily_rate.toLocaleString('da-DK')}
                      </p>
                    </div>
                  )}
                  {vehicle.mileage_limit && (
                    <div>
                      <p className="text-gray-500">Km-grænse/dag</p>
                      <p className="font-semibold text-gray-900">
                        {vehicle.mileage_limit} km
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingVehicle(vehicle)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(vehicle.id)}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slet køretøj?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på, at du vil slette dette køretøj? Denne handling kan ikke fortrydes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && handleDeleteVehicle(deleteId)}
            >
              Slet
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
