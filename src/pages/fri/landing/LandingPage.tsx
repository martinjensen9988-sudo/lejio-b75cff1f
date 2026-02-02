import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export function FriLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Lejio Fri</div>
          <div className="flex gap-4">
            <Link to="/fri/login">
              <Button variant="ghost">Log ind</Button>
            </Link>
            <Link to="/fri/signup">
              <Button>Kom i gang</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Dine køretøjer, dit kontrol
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          En moderne platform til bilutlejning. Administrer din flåde, bookinger og fakturaer fra ét sted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/fri/trial">
            <Button size="lg" className="gap-2">
              Start 14-dages gratis prøveperiode <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Se demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Funktioner</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Flådestyring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Administrer alle dine køretøjer på ét sted. Spor tilgængelighed, vedligeholdelse og dokumenter.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookinger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Modtag og administrer bookinger. Automatisk bekræftelse og påmindelser til dine kunder.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fakturaer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generer professionelle fakturaer automatisk. Spor betalinger og udestående beløb.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se indtjening, utilization og trends. Data-drevne indsigter til at vokse din forretning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teamsamarbejde</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Inviter teammedlemmer med tilpassede roller. Delegation og kontrol på dit vilkår.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumenter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gem kontrakter, forsikring og licenser sikkert. Nem adgang når du har brug for det.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Priser</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Professional */}
            <Card>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For enkeltmand og små flåder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">kr. 599</span>
                  <span className="text-gray-600">/måned</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>10 køretøjer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>3 teammedlemmer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Grundlæggende analytik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link to="/fri/signup?tier=professional">
                  <Button className="w-full" variant="outline">
                    Vælg plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business - Featured */}
            <Card className="md:scale-105 border-blue-500">
              <CardHeader>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm w-fit mb-2">
                  Mest populær
                </div>
                <CardTitle>Business</CardTitle>
                <CardDescription>Perfekt for voksende virksomheder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">kr. 999</span>
                  <span className="text-gray-600">/måned</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>50 køretøjer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>10 teammedlemmer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Avanceret analytik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>API adgang (read-only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Branding tilpasning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Email + Slack support</span>
                  </li>
                </ul>
                <Link to="/fri/signup?tier=business">
                  <Button className="w-full">Kom i gang</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For større netværk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">kr. 1.499</span>
                  <span className="text-gray-600">/måned</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Ubegrænsede køretøjer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Ubegrænsede brugere</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Fuldt API + webhooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Custom domæne</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>24/7 prioritets support</span>
                  </li>
                </ul>
                <Link to="/fri/signup?tier=enterprise">
                  <Button className="w-full" variant="outline">
                    Kontakt os
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Klar til at starte?</h2>
          <p className="text-xl mb-8">
            Prøv gratis i 14 dage. Intet kreditkort påkrævet.
          </p>
          <Link to="/fri/trial">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start gratis prøveperiode
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 Lejio Fri. Alle rettigheder forbeholdt.</p>
        </div>
      </footer>
    </div>
  );
}
