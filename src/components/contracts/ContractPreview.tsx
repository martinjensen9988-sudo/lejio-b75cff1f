import { Contract } from '@/hooks/useContracts';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { FileText, Car, User, Shield, AlertTriangle, Calendar, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ContractPreviewProps {
  contract: Contract;
}

const ContractPreview = ({ contract }: ContractPreviewProps) => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd. MMMM yyyy', { locale: da });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Ikke angivet';
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(amount);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Lejekontrakt</h2>
              <p className="text-sm text-muted-foreground">Nr. {contract.contract_number}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Oprettet</p>
            <p className="font-medium text-foreground">{formatDate(contract.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Vehicle Section */}
        <Section icon={Car} title="Køretøj">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Mærke & Model" value={`${contract.vehicle_make} ${contract.vehicle_model}`} />
            <InfoItem label="Nummerplade" value={contract.vehicle_registration} mono />
            {contract.vehicle_year && <InfoItem label="Årgang" value={contract.vehicle_year.toString()} />}
            {contract.vehicle_vin && <InfoItem label="Stelnummer (VIN)" value={contract.vehicle_vin} mono />}
            <InfoItem label="Køretøjets værdi" value={formatCurrency(contract.vehicle_value)} />
          </div>
        </Section>

        <Separator />

        {/* Rental Period */}
        <Section icon={Calendar} title="Lejeperiode">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Fra" value={formatDate(contract.start_date)} />
            <InfoItem label="Til" value={formatDate(contract.end_date)} />
            <InfoItem label="Dagspris" value={formatCurrency(contract.daily_price)} />
            <InfoItem label="Inkluderet km/dag" value={`${contract.included_km} km`} />
            <InfoItem label="Ekstra km pris" value={`${contract.extra_km_price} kr/km`} />
            <InfoItem label="Total pris" value={formatCurrency(contract.total_price)} highlight />
          </div>
        </Section>

        <Separator />

        {/* Parties */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section icon={User} title="Udlejer">
            <InfoItem label="Navn" value={contract.lessor_name} />
            <InfoItem label="Email" value={contract.lessor_email} />
            {contract.lessor_phone && <InfoItem label="Telefon" value={contract.lessor_phone} />}
            {contract.lessor_company_name && <InfoItem label="Virksomhed" value={contract.lessor_company_name} />}
            {contract.lessor_cvr && <InfoItem label="CVR" value={contract.lessor_cvr} />}
            {contract.lessor_address && <InfoItem label="Adresse" value={contract.lessor_address} />}
          </Section>

          <Section icon={User} title="Lejer">
            <InfoItem label="Navn" value={contract.renter_name} />
            <InfoItem label="Email" value={contract.renter_email || 'Afventer'} />
            {contract.renter_phone && <InfoItem label="Telefon" value={contract.renter_phone} />}
            {contract.renter_license_number && <InfoItem label="Kørekort nr." value={contract.renter_license_number} />}
          </Section>
        </div>

        <Separator />

        {/* Insurance */}
        <Section icon={Shield} title="Forsikring">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Forsikringsselskab" value={contract.insurance_company || 'Ikke angivet'} />
            <InfoItem label="Policenummer" value={contract.insurance_policy_number || 'Ikke angivet'} />
            <InfoItem label="Selvrisiko" value={formatCurrency(contract.deductible_amount)} />
            <InfoItem label="Depositum" value={formatCurrency(contract.deposit_amount)} />
          </div>
        </Section>

        <Separator />

        {/* Vanvidskørsel Clause */}
        <div className="bg-destructive/5 rounded-xl p-5 border border-destructive/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground mb-2">Vanvidskørselsklausul</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Ved overtrædelse af færdselsloven, der medfører konfiskation af køretøjet i henhold til 
                vanvidskørselsreglerne, hæfter lejer for køretøjets fulde værdi.
              </p>
              <div className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                <span className="text-sm font-medium text-foreground">Erstatningsbeløb ved vanvidskørsel:</span>
                <span className="font-display font-bold text-destructive">
                  {formatCurrency(contract.vanvidskørsel_liability_amount)}
                </span>
              </div>
              {contract.vanvidskørsel_accepted && (
                <div className="mt-3 flex items-center gap-2 text-sm text-mint">
                  <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">✓</div>
                  Accepteret af lejer
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-muted/50 rounded-xl p-5">
          <h3 className="font-display font-bold text-foreground mb-3">Generelle vilkår</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Køretøjet skal afleveres i samme stand som ved modtagelse</li>
            <li>• Rygning i køretøjet er ikke tilladt</li>
            <li>• Lejer er ansvarlig for at overholde færdselsreglerne</li>
            <li>• Ved skader skal udlejer kontaktes omgående</li>
            <li>• Lejer hæfter for selvrisiko ved forsikringsskader</li>
            <li>• Ved overskridelse af inkluderede km beregnes ekstra km-pris</li>
            <li>• Køretøjet må kun føres af den angivne lejer</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <SignatureBlock
            label="Udlejers underskrift"
            name={contract.lessor_name}
            signature={contract.lessor_signature}
            signedAt={contract.lessor_signed_at}
          />
          <SignatureBlock
            label="Lejers underskrift"
            name={contract.renter_name}
            signature={contract.renter_signature}
            signedAt={contract.renter_signed_at}
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="font-display font-bold text-foreground">{title}</h3>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoItem = ({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-sm ${mono ? 'font-mono' : ''} ${highlight ? 'font-bold text-primary' : 'text-foreground'}`}>
      {value}
    </p>
  </div>
);

const SignatureBlock = ({ label, name, signature, signedAt }: { 
  label: string; 
  name: string; 
  signature: string | null; 
  signedAt: string | null;
}) => (
  <div className="border border-border rounded-xl p-4">
    <p className="text-sm text-muted-foreground mb-2">{label}</p>
    {signature ? (
      <div>
        <img src={signature} alt="Underskrift" className="h-16 object-contain mb-2" />
        <p className="text-sm font-medium text-foreground">{name}</p>
        {signedAt && (
          <p className="text-xs text-muted-foreground">
            Underskrevet {format(new Date(signedAt), 'd. MMM yyyy HH:mm', { locale: da })}
          </p>
        )}
      </div>
    ) : (
      <div className="h-20 border-b-2 border-dashed border-muted-foreground/30 flex items-end pb-2">
        <p className="text-sm text-muted-foreground italic">Afventer underskrift...</p>
      </div>
    )}
  </div>
);

export default ContractPreview;
