import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Download, Eye, Calendar, CreditCard } from 'lucide-react';
import { CorporateInvoice } from '@/hooks/useCorporateFleet';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface CorporateInvoicesTabProps {
  invoices: CorporateInvoice[];
}

const CorporateInvoicesTab = ({ invoices }: CorporateInvoicesTabProps) => {
  const getStatusBadge = (status: CorporateInvoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Betalt</Badge>;
      case 'issued':
        return <Badge className="bg-blue-100 text-blue-800">Udstedt</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Forfalden</Badge>;
      case 'draft':
        return <Badge variant="secondary">Kladde</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Annulleret</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const unpaidTotal = invoices
    .filter(inv => inv.status === 'issued' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fakturaer</h2>
          <p className="text-muted-foreground">
            {invoices.length} fakturaer i alt
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total fakturaer</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubetalt</p>
                <p className="text-2xl font-bold">{unpaidTotal.toLocaleString('da-DK')} kr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Næste faktura</p>
                <p className="text-2xl font-bold">1. feb</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fakturaoversigt</CardTitle>
          <CardDescription>
            Alle fakturaer for virksomhedens flådebrug
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ingen fakturaer endnu</h3>
              <p className="text-muted-foreground">
                Den første faktura genereres ved udgangen af den første måned
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fakturanr.</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Bookinger</TableHead>
                    <TableHead>Km kørt</TableHead>
                    <TableHead>Beløb</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.invoice_period_start), 'MMM yyyy', { locale: da })}
                      </TableCell>
                      <TableCell>{invoice.total_bookings}</TableCell>
                      <TableCell>{invoice.total_km_driven.toLocaleString('da-DK')} km</TableCell>
                      <TableCell className="font-medium">
                        {invoice.total_amount.toLocaleString('da-DK')} kr
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.pdf_url && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporateInvoicesTab;
