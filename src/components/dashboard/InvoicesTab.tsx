import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { toast } from 'sonner';

const InvoicesTab = () => {
  const { 
    invoices, 
    isLoading, 
    markAsPaid, 
    cancelInvoice,
    getUnpaidInvoices,
    getPaidInvoices,
    getOverdueInvoices
  } = useInvoices();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleMarkAsPaid = async (id: string) => {
    setActionLoading(id);
    const success = await markAsPaid(id);
    if (success) {
      toast.success('Faktura markeret som betalt');
    }
    setActionLoading(null);
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    const success = await cancelInvoice(id);
    if (success) {
      toast.success('Faktura annulleret');
    }
    setActionLoading(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Betalt</Badge>;
      case 'issued':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Afventer</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Forfalden</Badge>;
      case 'cancelled':
        return <Badge className="bg-muted text-muted-foreground">Annulleret</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const unpaidInvoices = getUnpaidInvoices();
  const paidInvoices = getPaidInvoices();
  const overdueInvoices = getOverdueInvoices();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const InvoiceTable = ({ invoiceList, showActions = true }: { invoiceList: typeof invoices, showActions?: boolean }) => (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Fakturanr.</TableHead>
            <TableHead>Lejer</TableHead>
            <TableHead>Beløb</TableHead>
            <TableHead>Forfaldsdato</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Handlinger</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-muted-foreground">
                Ingen fakturaer at vise
              </TableCell>
            </TableRow>
          ) : (
            invoiceList.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.renter_name || 'Ukendt'}</p>
                    <p className="text-sm text-muted-foreground">{invoice.renter_email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {invoice.total_amount.toLocaleString('da-DK')} {invoice.currency}
                </TableCell>
                <TableCell>
                  {invoice.due_date 
                    ? format(new Date(invoice.due_date), 'dd. MMM yyyy', { locale: da })
                    : '-'
                  }
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.pdf_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.pdf_url!, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      {invoice.status === 'issued' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            disabled={actionLoading === invoice.id}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(invoice.id)}
                            disabled={actionLoading === invoice.id}
                          >
                            <XCircle className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoices.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unpaidInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Afventer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{paidInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Betalt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Forfaldne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle ({invoices.length})</TabsTrigger>
          <TabsTrigger value="unpaid">Afventer ({unpaidInvoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Betalt ({paidInvoices.length})</TabsTrigger>
          {overdueInvoices.length > 0 && (
            <TabsTrigger value="overdue" className="text-red-600">
              Forfaldne ({overdueInvoices.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all">
          <InvoiceTable invoiceList={invoices} />
        </TabsContent>
        
        <TabsContent value="unpaid">
          <InvoiceTable invoiceList={unpaidInvoices} />
        </TabsContent>
        
        <TabsContent value="paid">
          <InvoiceTable invoiceList={paidInvoices} showActions={false} />
        </TabsContent>
        
        <TabsContent value="overdue">
          <InvoiceTable invoiceList={overdueInvoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoicesTab;
