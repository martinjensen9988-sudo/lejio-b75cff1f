import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus } from 'lucide-react';

const AdminInvoicesPage = () => {
  const { invoices, isLoading, generateInvoice, markAsPaid, cancelInvoice, refetch } = useInvoices();
  const [generating, setGenerating] = useState(false);

  // For demo: Generate invoice for a bookingId (should be selected from UI)
  const handleGenerate = async () => {
    setGenerating(true);
    // TODO: Replace with actual bookingId selection
    const bookingId = prompt('Indtast booking ID til faktura:');
    if (bookingId) {
      await generateInvoice(bookingId);
      refetch();
    }
    setGenerating(false);
  };

  return (
    <AdminDashboardLayout activeTab="invoices">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Fakturaer til udlejere</h2>
        <Button onClick={handleGenerate} disabled={generating}>
          <Plus className="w-4 h-4 mr-2" /> Opret faktura
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Alle fakturaer</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faktura nr.</TableHead>
                  <TableHead>Udlejer</TableHead>
                  <TableHead>Beløb</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Oprettet</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.invoice_number}</TableCell>
                    <TableCell>{inv.lessor_id}</TableCell>
                    <TableCell>{inv.total_amount} {inv.currency}</TableCell>
                    <TableCell>{inv.status}</TableCell>
                    <TableCell>{inv.created_at?.slice(0,10)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => markAsPaid(inv.id)} disabled={inv.status === 'paid'}>Markér som betalt</Button>
                      <Button size="sm" variant="ghost" onClick={() => cancelInvoice(inv.id)} disabled={inv.status === 'cancelled'}>Annullér</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminInvoicesPage;
