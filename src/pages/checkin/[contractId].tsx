
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/azure/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function CheckinPage() {
  const { contractId } = useParams();
  const [contract, setContract] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (!contractId) return;
    const fetchContract = async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();
      if (error) {
        console.error('Failed to fetch contract:', error);
        setPinError('Kunne ikke hente kontrakt. Tjek venligst linket.');
      } else if (data) {
        setContract(data);
      }
      setLoading(false);
    };
    fetchContract();
  }, [contractId]);

  const handleCheckin = async () => {
    setPinError('');
    if (!contractId) return;
    if (!contract || !contract.checkin_pin) {
      setPinError('Der mangler PIN-kode på kontrakten. Kontakt udlejer.');
      return;
    }
    // Remove all whitespace from user input and normalize
    const normalizedPin = pin.replace(/\s/g, '');
    if (normalizedPin !== String(contract.checkin_pin)) {
      setPinError('Forkert PIN-kode. Prøv igen.');
      return;
    }
    const { error } = await supabase
      .from('contracts')
      .update({ checked_in_at: new Date().toISOString() })
      .eq('id', contractId);
    if (!error) {
      setCheckedIn(true);
      toast({ title: 'Check-in registreret', description: 'Du er nu checket ind!', variant: 'default' });
    } else {
      toast({ title: 'Fejl ved check-in', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8 text-center">Indlæser kontrakt...</div>;
  if (!contract) return <div className="p-8 text-center text-red-500">Kontrakt ikke fundet.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Check-in for lejekontrakt</h1>
      <div className="mb-4 text-center">
        <div className="font-mono text-lg">{contract.contract_number}</div>
        <div className="text-gray-500 text-sm mt-1">{contract.renter_name}</div>
        <div className="text-gray-500 text-sm">
          {contract.vehicle_make && contract.vehicle_model 
            ? `${contract.vehicle_make} ${contract.vehicle_model}` 
            : contract.vehicle_id}
        </div>
        <div className="text-xs text-gray-400 mt-2">(ID: {contract.vehicle_id})</div>
      </div>
      {checkedIn || contract.checked_in_at ? (
        <div className="text-green-600 font-semibold text-lg mt-4">Du er allerede checket ind!</div>
      ) : (
        <>
          <label className="block text-sm font-medium mb-1" htmlFor="pin">Indtast din PIN-kode</label>
          <input
            id="pin"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="border rounded px-3 py-2 text-lg text-center tracking-widest mb-2 w-full"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleCheckin()}
            autoComplete="one-time-code"
            placeholder="000000"
            autoFocus
          />
          {pinError && <div className="text-red-500 text-sm mb-2">{pinError}</div>}
          <Button size="lg" className="mt-2 w-full" onClick={handleCheckin}>Bekræft check-in</Button>
        </>
      )}
    </div>
  );
}
