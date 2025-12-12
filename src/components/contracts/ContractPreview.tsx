import { Contract } from '@/hooks/useContracts';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface ContractPreviewProps {
  contract: Contract;
}

const ContractPreview = ({ contract }: ContractPreviewProps) => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd. MMMM yyyy', { locale: da });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="bg-white text-gray-900 font-sans max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b-4 border-primary pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Lejekontrakt {contract.contract_number}</h1>
            <p className="text-sm text-gray-600 mt-1">LEJIO - Biludlejning</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Oprettet</p>
            <p className="text-sm font-medium">{formatDate(contract.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Udlejer Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Udlejer</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Navn:</span>
            <span className="ml-4 font-medium">{contract.lessor_name}</span>
          </div>
          {contract.lessor_company_name && (
            <div>
              <span className="text-gray-500">Virksomhed:</span>
              <span className="ml-4 font-medium">{contract.lessor_company_name}</span>
            </div>
          )}
          {contract.lessor_cvr && (
            <div>
              <span className="text-gray-500">CVR. Nr.:</span>
              <span className="ml-4 font-medium">{contract.lessor_cvr}</span>
            </div>
          )}
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-4 font-medium">{contract.lessor_email}</span>
          </div>
          {contract.lessor_phone && (
            <div>
              <span className="text-gray-500">Telefon:</span>
              <span className="ml-4 font-medium">{contract.lessor_phone}</span>
            </div>
          )}
          {contract.lessor_address && (
            <div className="col-span-2">
              <span className="text-gray-500">Adresse:</span>
              <span className="ml-4 font-medium">{contract.lessor_address}</span>
            </div>
          )}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Lejer Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Lejer</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Navn:</span>
            <span className="ml-4 font-medium">{contract.renter_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-4 font-medium">{contract.renter_email || 'Afventer'}</span>
          </div>
          {contract.renter_phone && (
            <div>
              <span className="text-gray-500">Telefon:</span>
              <span className="ml-4 font-medium">{contract.renter_phone}</span>
            </div>
          )}
          {contract.renter_address && (
            <div className="col-span-2">
              <span className="text-gray-500">Adresse:</span>
              <span className="ml-4 font-medium">{contract.renter_address}</span>
            </div>
          )}
          {contract.renter_license_number && (
            <div>
              <span className="text-gray-500">Kørekort nr.:</span>
              <span className="ml-4 font-medium font-mono">{contract.renter_license_number}</span>
            </div>
          )}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Lejebil Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Lejebil</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Reg. nr.:</span>
            <span className="ml-4 font-medium font-mono">{contract.vehicle_registration}</span>
          </div>
          <div>
            <span className="text-gray-500">Mærke, model:</span>
            <span className="ml-4 font-medium">{contract.vehicle_make}, {contract.vehicle_model}</span>
          </div>
          {contract.vehicle_year && (
            <div>
              <span className="text-gray-500">Årgang:</span>
              <span className="ml-4 font-medium">{contract.vehicle_year}</span>
            </div>
          )}
          {contract.vehicle_vin && (
            <div className="col-span-2">
              <span className="text-gray-500">Stelnummer (VIN):</span>
              <span className="ml-4 font-medium font-mono text-xs">{contract.vehicle_vin}</span>
            </div>
          )}
          {contract.vehicle_value && (
            <div>
              <span className="text-gray-500">Køretøjets værdi:</span>
              <span className="ml-4 font-medium">{formatCurrency(contract.vehicle_value)}</span>
            </div>
          )}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Lejeaftale Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Lejeaftale</h2>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Periode</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Fra dato:</span>
              <span className="ml-4 font-medium">{formatDate(contract.start_date)}</span>
            </div>
            <div>
              <span className="text-gray-500">Til dato:</span>
              <span className="ml-4 font-medium">{formatDate(contract.end_date)}</span>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Priser Section */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Priser</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Dagspris:</td>
                <td className="py-2 text-right font-medium">{formatCurrency(contract.daily_price)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Km inkluderet pr. dag:</td>
                <td className="py-2 text-right font-medium">{contract.included_km} km</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-600">Pris pr. overkørt km:</td>
                <td className="py-2 text-right font-medium">{contract.extra_km_price} kr inkl. moms</td>
              </tr>
              {contract.deposit_amount && contract.deposit_amount > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-600">Depositum:</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(contract.deposit_amount)}</td>
                </tr>
              )}
              <tr className="bg-primary/5">
                <td className="py-3 font-semibold">Total pris:</td>
                <td className="py-3 text-right font-bold text-primary text-lg">{formatCurrency(contract.total_price)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Forsikringsforhold */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Forsikringsforhold</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Selvrisiko:</span>
            <span className="ml-4 font-medium">{formatCurrency(contract.deductible_amount)} (momsfri)</span>
          </div>
          {contract.insurance_company && (
            <div>
              <span className="text-gray-500">Forsikringsselskab:</span>
              <span className="ml-4 font-medium">{contract.insurance_company}</span>
            </div>
          )}
          {contract.insurance_policy_number && (
            <div className="col-span-2">
              <span className="text-gray-500">Policenummer:</span>
              <span className="ml-4 font-medium font-mono">{contract.insurance_policy_number}</span>
            </div>
          )}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Vejhjælp Section */}
      {(contract.roadside_assistance_provider || contract.roadside_assistance_phone) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Vejhjælp</h2>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {contract.roadside_assistance_provider && (
                <div>
                  <span className="text-gray-500">Udbyder:</span>
                  <span className="ml-4 font-medium">{contract.roadside_assistance_provider}</span>
                </div>
              )}
              {contract.roadside_assistance_phone && (
                <div>
                  <span className="text-gray-500">Telefon:</span>
                  <span className="ml-4 font-medium font-mono">{contract.roadside_assistance_phone}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Ved behov for vejhjælp kontakt venligst ovenstående nummer.
            </p>
          </div>
        </section>
      )}

      {/* Brændstofpolitik Section */}
      {contract.fuel_policy_enabled && (
        <>
          <Separator className="my-4" />
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Brændstofpolitik</h2>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Køretøjet udleveres med fuld tank og skal afleveres med fuld tank. Såfremt tanken ikke er fyldt ved aflevering, 
                gælder følgende:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {contract.fuel_missing_fee && contract.fuel_missing_fee > 0 && (
                  <div className="bg-white rounded p-3 border border-amber-200">
                    <span className="text-gray-500 block text-xs">Gebyr ved manglende optankning:</span>
                    <span className="font-bold text-lg">{formatCurrency(contract.fuel_missing_fee)}</span>
                  </div>
                )}
                {contract.fuel_price_per_liter && contract.fuel_price_per_liter > 0 && (
                  <div className="bg-white rounded p-3 border border-amber-200">
                    <span className="text-gray-500 block text-xs">Pris pr. liter manglende brændstof:</span>
                    <span className="font-bold text-lg">{formatCurrency(contract.fuel_price_per_liter)}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <Separator className="my-4" />

      {/* Førerforhold */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Førerforhold</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Bilen må kun føres af den lejer, der har tegnet lejekontrakten samt personer – over 23 år – der hører til 
          lejers husstand, hvis disse har et gyldigt dansk kørekort, og erklærer at overholde færdselslovens 
          bestemmelser ved deres brug af bilen. Bilen må ikke fremlejes, benyttes til motorsport, eller til person- 
          eller godstransport mod betaling.
        </p>
      </section>

      <Separator className="my-4" />

      {/* Vanvidskørsel */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-destructive border-b border-destructive/20 pb-2 mb-4">Vanvidskørsel</h2>
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Ved lejers underskrift, erklærer lejer, at lejer – og dem lejer måtte overlade bilen til – ikke tidligere 
            har kørt i en bil, eller vil køre i denne bil, på en måde, der kan karakteriseres som vanvidskørsel, jf. 
            færdselslovens § 133a, herunder f.eks. ved kørsel med hastighed over 200 km/t, mere end 100% overskridelse 
            af hastighedsgrænsen eller spirituskørsel.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Lejer er indforstået med og accepterer, at lejer personligt kan blive pålagt det fulde erstatningsansvar 
            ved konfiskation af bilen som følge af vanvidskørsel.
          </p>
          {contract.vanvidskørsel_liability_amount && (
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-destructive/20">
              <span className="text-sm font-medium">Erstatningsansvar ved konfiskation:</span>
              <span className="font-bold text-destructive text-lg">{formatCurrency(contract.vanvidskørsel_liability_amount)}</span>
            </div>
          )}
          {contract.vanvidskørsel_accepted && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div>
              Accepteret af lejer
            </div>
          )}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Vilkår */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Generelle vilkår</h2>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>Køretøjet skal afleveres i samme stand som ved modtagelse</li>
          <li>Rygning i køretøjet er ikke tilladt</li>
          <li>Lejer er ansvarlig for at overholde færdselsreglerne</li>
          <li>Ved skader skal udlejer kontaktes omgående</li>
          <li>Lejer hæfter for selvrisiko ved forsikringsskader</li>
          <li>Ved overskridelse af inkluderede km beregnes ekstra km-pris</li>
          <li>Køretøjet må kun føres af den angivne lejer</li>
          <li>Alle bøder og afgifter pålagt køretøjet i lejeperioden betales af lejer</li>
        </ul>
      </section>

      <Separator className="my-4" />

      {/* Underskrifter */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">Underskrifter</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Udlejer underskrift */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Udlejer v/ underskrift</p>
            {contract.lessor_signature ? (
              <div>
                <img src={contract.lessor_signature} alt="Udlejer underskrift" className="h-16 object-contain mb-2" />
                <p className="text-sm font-medium">{contract.lessor_name}</p>
                {contract.lessor_signed_at && (
                  <p className="text-xs text-gray-500">
                    {format(new Date(contract.lessor_signed_at), 'd. MMM yyyy HH:mm', { locale: da })}
                  </p>
                )}
              </div>
            ) : (
              <div className="h-20 border-b-2 border-dashed border-gray-300 flex items-end pb-2">
                <p className="text-sm text-gray-400 italic">Afventer underskrift...</p>
              </div>
            )}
          </div>

          {/* Lejer underskrift */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Lejer v/ underskrift</p>
            {contract.renter_signature ? (
              <div>
                <img src={contract.renter_signature} alt="Lejer underskrift" className="h-16 object-contain mb-2" />
                <p className="text-sm font-medium">{contract.renter_name}</p>
                {contract.renter_signed_at && (
                  <p className="text-xs text-gray-500">
                    {format(new Date(contract.renter_signed_at), 'd. MMM yyyy HH:mm', { locale: da })}
                  </p>
                )}
              </div>
            ) : (
              <div className="h-20 border-b-2 border-dashed border-gray-300 flex items-end pb-2">
                <p className="text-sm text-gray-400 italic">Afventer underskrift...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 mt-8">
        <p className="text-xs text-gray-400 text-center">
          Genereret af LEJIO • lejio.dk • Kontrakt nr. {contract.contract_number}
        </p>
      </div>
    </div>
  );
};

export default ContractPreview;
