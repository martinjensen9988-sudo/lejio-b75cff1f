import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';
import { useSalesLeads, SalesLead } from '@/hooks/useSalesLeads';
import { 
  ArrowLeft, ArrowRight, Phone, Mail, Sparkles, Copy, Send, 
  Loader2, Building2, Check, CheckCircle2, Clock, MessageSquare,
  RefreshCw, User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Forberedelse', icon: Building2 },
  { id: 2, name: 'Ring op', icon: Phone },
  { id: 3, name: 'Generer email', icon: Mail },
  { id: 4, name: 'Send & Afslut', icon: Send },
];

const SalesAIOutreachPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { leads, fetchLeads, generateEmail, saveEmail, updateLead } = useSalesLeads();
  
  const [lead, setLead] = useState<SalesLead | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Call notes
  const [callCompleted, setCallCompleted] = useState(false);
  const [callOutcome, setCallOutcome] = useState<string>('');
  const [callNotes, setCallNotes] = useState('');
  
  // Email
  const [emailType, setEmailType] = useState('introduction');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (leads.length > 0 && id) {
      const foundLead = leads.find(l => l.id === id);
      setLead(foundLead || null);
    }
  }, [leads, id]);

  const handleGenerateEmail = async () => {
    if (!lead) return;
    
    setIsGenerating(true);
    
    // Pass call context to AI for personalized email
    const callContext = callOutcome && callNotes ? {
      outcome: callOutcome,
      notes: callNotes
    } : undefined;
    
    const result = await generateEmail(lead, emailType, callContext);
    if (result) {
      setGeneratedEmail(result);
    }
    setIsGenerating(false);
  };

  const handleCopyEmail = () => {
    if (!generatedEmail) return;
    
    const text = `Emne: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Kopieret',
      description: 'Email er kopieret til udklipsholder',
    });
  };

  const handleComplete = async () => {
    if (!lead) return;
    
    setIsSaving(true);
    
    // Save email if generated
    if (generatedEmail) {
      await saveEmail(lead.id, generatedEmail.subject, generatedEmail.body);
    }
    
    // Update lead status and notes
    await updateLead(lead.id, { 
      status: callOutcome === 'interested' ? 'interested' : 
              callOutcome === 'not_interested' ? 'not_interested' : 'contacted',
      last_contacted_at: new Date().toISOString(),
      notes: callNotes ? `${lead.notes || ''}\n\n[${new Date().toLocaleDateString('da-DK')}] Opkald: ${callOutcome}\n${callNotes}`.trim() : lead.notes
    });
    
    setIsSaving(false);
    toast({
      title: 'Outreach gennemført',
      description: 'Lead er opdateret med opkaldsnoter og email',
    });
    navigate('/admin/sales-ai');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return callCompleted && callOutcome;
      case 3: return generatedEmail !== null;
      case 4: return true;
      default: return false;
    }
  };

  if (!lead) {
    return (
      <AdminDashboardLayout activeTab="sales-ai">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout activeTab="sales-ai">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/sales-ai')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Salgs-outreach</h2>
            <p className="text-muted-foreground">{lead.company_name}</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                    currentStep > step.id 
                      ? "bg-green-500 border-green-500 text-white" 
                      : currentStep === step.id 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "text-sm mt-2 font-medium",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "w-24 h-1 mx-2",
                    currentStep > step.id ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <Card className="min-h-[400px]">
          <CardContent className="pt-6">
            {/* Step 1: Preparation */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="w-5 h-5 text-primary" />
                  Forberedelse - Lær virksomheden at kende
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Virksomhedsinfo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Navn</p>
                        <p className="font-medium">{lead.company_name}</p>
                      </div>
                      {lead.cvr_number && (
                        <div>
                          <p className="text-sm text-muted-foreground">CVR</p>
                          <p className="font-medium">{lead.cvr_number}</p>
                        </div>
                      )}
                      {lead.industry && (
                        <div>
                          <p className="text-sm text-muted-foreground">Branche</p>
                          <p className="font-medium">{lead.industry}</p>
                        </div>
                      )}
                      {lead.city && (
                        <div>
                          <p className="text-sm text-muted-foreground">By</p>
                          <p className="font-medium">{lead.city}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Kontaktperson
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {lead.contact_name && (
                        <div>
                          <p className="text-sm text-muted-foreground">Navn</p>
                          <p className="font-medium">{lead.contact_name}</p>
                        </div>
                      )}
                      {lead.contact_phone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Telefon</p>
                          <a 
                            href={`tel:${lead.contact_phone}`}
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            {lead.contact_phone}
                          </a>
                        </div>
                      )}
                      {lead.contact_email && (
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{lead.contact_email}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="font-medium mb-2">💡 Forberedelsestips</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Undersøg virksomhedens hjemmeside inden du ringer</li>
                    <li>• Identificer hvordan LEJIO kan løse deres specifikke behov</li>
                    <li>• Hav et klart formål med opkaldet</li>
                    <li>• Vær klar til at besvare spørgsmål om priser og funktioner</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Step 2: Phone Call */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Phone className="w-5 h-5 text-primary" />
                  Ring til kunden
                </div>
                
                {lead.contact_phone ? (
                  <div className="flex items-center justify-center py-8">
                    <a 
                      href={`tel:${lead.contact_phone}`}
                      className="flex flex-col items-center gap-4 p-8 bg-green-50 rounded-2xl border-2 border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                        <Phone className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">{lead.contact_phone}</p>
                        <p className="text-sm text-green-600">Klik for at ringe</p>
                      </div>
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Intet telefonnummer registreret</p>
                  </div>
                )}
                
                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="callCompleted" 
                      checked={callCompleted}
                      onCheckedChange={(checked) => setCallCompleted(checked as boolean)}
                    />
                    <Label htmlFor="callCompleted" className="font-medium">
                      Jeg har gennemført opkaldet
                    </Label>
                  </div>
                  
                  {callCompleted && (
                    <div className="space-y-4 pl-6 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label>Hvad var udfaldet af opkaldet?</Label>
                        <Select value={callOutcome} onValueChange={setCallOutcome}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vælg udfald" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interested">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Interesseret - vil gerne høre mere
                              </div>
                            </SelectItem>
                            <SelectItem value="callback">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                Ring tilbage senere
                              </div>
                            </SelectItem>
                            <SelectItem value="send_info">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                Send mere info på mail
                              </div>
                            </SelectItem>
                            <SelectItem value="not_interested">
                              <div className="flex items-center gap-2">
                                <span className="text-red-500">✕</span>
                                Ikke interesseret
                              </div>
                            </SelectItem>
                            <SelectItem value="no_answer">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Ingen svar
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="callNotes">Noter fra samtalen</Label>
                        <Textarea
                          id="callNotes"
                          value={callNotes}
                          onChange={(e) => setCallNotes(e.target.value)}
                          placeholder="Hvad blev der talt om? Særlige interesser eller bekymringer?"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 3: Generate Email */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Mail className="w-5 h-5 text-primary" />
                  Generer opfølgningsmail
                </div>
                
                {callOutcome && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <span className="font-medium">Opkaldsudfald:</span> {
                      callOutcome === 'interested' ? 'Interesseret' :
                      callOutcome === 'callback' ? 'Ring tilbage' :
                      callOutcome === 'send_info' ? 'Send info' :
                      callOutcome === 'not_interested' ? 'Ikke interesseret' :
                      'Ingen svar'
                    }
                    {callNotes && <p className="mt-1 text-muted-foreground">{callNotes}</p>}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email-type</Label>
                    <Select value={emailType} onValueChange={setEmailType}>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="followup">
                          <div>
                            <p className="font-medium">Opfølgning på samtale</p>
                            <p className="text-xs text-muted-foreground">Refererer til jeres telefonsamtale</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="introduction">
                          <div>
                            <p className="font-medium">Introduktion</p>
                            <p className="text-xs text-muted-foreground">Generel præsentation af LEJIO</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="offer">
                          <div>
                            <p className="font-medium">Særligt tilbud</p>
                            <p className="text-xs text-muted-foreground">Tilbyd gratis prøveperiode</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleGenerateEmail} disabled={isGenerating} size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Genererer email...
                      </>
                    ) : generatedEmail ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generer ny email
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generer email med AI
                      </>
                    )}
                  </Button>
                </div>
                
                {generatedEmail && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Emne</Label>
                      <Input
                        id="subject"
                        value={generatedEmail.subject}
                        onChange={(e) => setGeneratedEmail({ ...generatedEmail, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body">Indhold</Label>
                      <Textarea
                        id="body"
                        value={generatedEmail.body}
                        onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                        rows={10}
                        className="font-sans"
                      />
                    </div>
                    
                    <Button variant="outline" onClick={handleCopyEmail}>
                      <Copy className="w-4 h-4 mr-2" />
                      Kopier til udklipsholder
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Opsummering
                </div>
                
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Opkald gennemført</p>
                          <p className="text-sm text-muted-foreground">
                            Udfald: {
                              callOutcome === 'interested' ? 'Interesseret' :
                              callOutcome === 'callback' ? 'Ring tilbage' :
                              callOutcome === 'send_info' ? 'Send info' :
                              callOutcome === 'not_interested' ? 'Ikke interesseret' :
                              'Ingen svar'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {generatedEmail && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Email klar</p>
                            <p className="text-sm text-muted-foreground">
                              {generatedEmail.subject}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {callNotes && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Noter</p>
                            <p className="text-sm text-muted-foreground">
                              {callNotes}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">Klar til at gemme?</p>
                  <p className="text-sm text-green-700">
                    Lead status opdateres, noter gemmes, og email arkiveres.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/admin/sales-ai')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Tilbage til oversigt' : 'Tilbage'}
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Næste
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Afslut outreach
            </Button>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default SalesAIOutreachPage;
