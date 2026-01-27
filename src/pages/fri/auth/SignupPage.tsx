import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFriAuth } from '@/hooks/useFriAuth';
import { useFriAuthContext } from '@/providers/FriAuthProvider';
import { useCreateLessorAccount } from '@/hooks/useLessorAccount';

export function FriSignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user: authUser } = useFriAuth();
  const { user: contextUser } = useFriAuthContext();
  const { createAccount } = useCreateLessorAccount();

  const selectedTier = searchParams.get('tier') || 'business';
  const currentUser = contextUser || authUser;

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    cvr: '',
    primaryColor: '#0066cc',
    customDomain: '',
  });

  const [step, setStep] = useState<'credentials' | 'company' | 'branding'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp(formData.email, formData.password);
      setStep('company');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      setError('Virksomhedsnavn er påkrævet');
      return;
    }
    if (!formData.customDomain) {
      setError('Domæne er påkrævet');
      return;
    }
    setError(null);
    setStep('branding');
  };

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      // Create lessor account in Azure
      const account = await createAccount({
        userId: currentUser.id,
        email: formData.email,
        companyName: formData.companyName,
        cvr: formData.cvr || undefined,
        customDomain: formData.customDomain,
        primaryColor: formData.primaryColor,
      });

      if (!account) {
        throw new Error('Failed to create account');
      }

      // Redirect to dashboard
      navigate('/fri/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lejio Fri</h1>
          <p className="text-gray-600">Kom i gang med din bilutlejningsplatform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'credentials' && 'Opret konto'}
              {step === 'company' && 'Om din virksomhed'}
              {step === 'branding' && 'Tilpas dit udseende'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Credentials */}
            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="din@email.dk"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adgangskode
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimum 8 tegn"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    ✓ <strong>14 dages gratis prøveperiode</strong> inkluderet
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Plan: <strong>{selectedTier === 'professional' ? 'Professional (kr. 599/måned)' : selectedTier === 'business' ? 'Business (kr. 999/måned)' : 'Enterprise (kr. 1.499/måned)'}</strong>
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded text-red-800 text-sm p-3">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Opretter...' : 'Næste'}
                </Button>
              </form>
            )}

            {/* Step 2: Company */}
            {step === 'company' && (
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Virksomhedsnavn
                  </label>
                  <Input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="f.eks. Biluthyr ApS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVR-nummer (valgfrit)
                  </label>
                  <Input
                    type="text"
                    value={formData.cvr}
                    onChange={(e) =>
                      setFormData({ ...formData, cvr: e.target.value })
                    }
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dit domæne
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={formData.customDomain}
                      onChange={(e) =>
                        setFormData({ ...formData, customDomain: e.target.value })
                      }
                      placeholder="biluthyr"
                      required
                    />
                    <span className="text-gray-600 px-3 py-2 bg-gray-100 rounded text-sm whitespace-nowrap">
                      .lejio-fri.app
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dit dashboard vil være tilgængeligt på: {formData.customDomain || 'your-domain'}.lejio-fri.app
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded text-red-800 text-sm p-3">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('credentials')}
                  >
                    Tilbage
                  </Button>
                  <Button type="submit" className="flex-1">
                    Næste
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Branding */}
            {step === 'branding' && (
              <form onSubmit={handleBrandingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primær farve
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-gray-600 text-sm">{formData.primaryColor}</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div
                    className="h-20 rounded flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.companyName || 'Din virksomhed'}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    Logo og branding kan tilpasses senere i indstillinger.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded text-red-800 text-sm p-3">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('company')}
                  >
                    Tilbage
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Opretter...' : 'Fuldfør tilmelding'}
                  </Button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Har du allerede en konto?{' '}
              <button
                onClick={() => navigate('/fri/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Log ind her
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
