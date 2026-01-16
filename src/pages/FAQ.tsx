import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Car, User, CreditCard, Shield, FileText, HelpCircle, Bot, Wrench, TrendingDown, Languages, Percent } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "For lejere",
      icon: User,
      questions: [
        {
          q: "Hvordan lejer jeg en bil på LEJIO?",
          a: "Det er nemt! Søg efter en bil i din ønskede lokation, vælg datoer, udfyld dine oplysninger og book. Du modtager en lejekontrakt, som du skal underskrive digitalt, før udlejningen kan begynde."
        },
        {
          q: "Hvad skal jeg have med for at leje en bil?",
          a: "Du skal have gyldigt kørekort (minimum 2 år gammelt), gyldigt ID (pas eller kørekort), og du skal være mindst 21 år gammel. Nogle udlejere kan have yderligere krav."
        },
        {
          q: "Hvordan fungerer depositum?",
          a: "Udlejeren kan kræve et depositum som sikkerhed. Dette tilbagebetales efter returneringen af bilen, fratrukket eventuelle omkostninger til skader, manglende brændstof eller andre udeståender."
        },
        {
          q: "Hvad sker der, hvis bilen får en skade under min leje?",
          a: "Du skal straks kontakte udlejeren og dokumentere skaden med billeder. Skader dækkes typisk af udlejers forsikring, men du kan være ansvarlig for selvrisikoen. Ved groft uagtsom kørsel kan du hæfte for hele skaden."
        },
        {
          q: "Kan jeg afbestille min booking?",
          a: "Ja, men afbestillingsreglerne afhænger af tidspunktet: Mere end 48 timer før = fuld refundering, 24-48 timer før = 50% refundering, mindre end 24 timer før = ingen refundering."
        },
        {
          q: "Hvordan kontakter jeg udlejeren?",
          a: "Du kan bruge vores beskedsystem til at kommunikere direkte med udlejeren. Gå til 'Beskeder' i menuen for at se dine samtaler."
        },
        {
          q: "Kan jeg få beskeder oversat automatisk?",
          a: "Ja! Vores AI-drevne oversættelsesfunktion kan automatisk oversætte beskeder fra udenlandske lejere eller udlejere. Tryk på oversæt-ikonet ved en besked for at få den oversat til dansk."
        },
        {
          q: "Hvad er en advarsel, og hvordan påvirker det mig?",
          a: "Udlejere kan registrere advarsler mod lejere ved problemer som skader eller manglende betaling. Advarsler er synlige for andre udlejere i op til 5 år, men du kan klage, hvis du mener advarslen er uberettiget."
        },
        {
          q: "Hvordan fungerer dynamisk selvrisiko?",
          a: "Nogle udlejere tilbyder reduceret selvrisiko baseret på din lejerhistorik. Har du mange gode bookinger og høje ratings, kan du kvalificere dig til lavere selvrisiko. Dette ses ved booking."
        }
      ]
    },
    {
      title: "For udlejere",
      icon: Car,
      questions: [
        {
          q: "Hvordan kommer jeg i gang som udlejer?",
          a: "Opret en konto, vælg om du er privat udlejer eller forhandler, tilføj dine køretøjer med billeder og priser, og du er klar til at modtage bookinger!"
        },
        {
          q: "Hvad koster det at bruge LEJIO?",
          a: "Private udlejere betaler 49 kr pr. gennemført booking. Forhandlere (CVR) betaler 299-799 kr/måned afhængig af antal køretøjer, uden pr. booking gebyr. LEJIO Varetager har 10-15% kommission."
        },
        {
          q: "Hvordan får jeg mine penge?",
          a: "Betalingen håndteres direkte mellem dig og lejeren via din valgte betalingsmetode (kort, bankoverførsel, MobilePay eller kontant). LEJIO håndterer ikke pengene."
        },
        {
          q: "Skal jeg have forsikring på min bil?",
          a: "Ja, alle køretøjer skal have minimum lovpligtig ansvarsforsikring. Vi anbefaler også kaskoforsikring. Du skal angive dit forsikringsselskab og policenummer i dine indstillinger."
        },
        {
          q: "Hvordan opretter jeg en advarsel mod en lejer?",
          a: "Gå til din booking i dashboardet og vælg 'Opret advarsel'. Udfyld årsagen og beskrivelsen. Lejeren vil blive informeret og kan klage over advarslen."
        },
        {
          q: "Hvad er forskellen på Privat og Forhandler?",
          a: "Private udlejere betaler pr. booking (49 kr), mens Forhandlere (med CVR) betaler fast månedsbeløb uden pr. booking gebyr. Forhandlere får også 14 dages gratis prøveperiode og kan uploade firmalogo til kontrakter."
        },
        {
          q: "Hvordan fungerer LEJIO Varetager?",
          a: "Med LEJIO Varetager håndterer vi platform og kundeservice (15% kommission), eller alt inkl. afhentning, levering og rengøring (10% kommission). Kontakt os for mere info."
        }
      ]
    },
    {
      title: "AI Flådestyring",
      icon: Bot,
      questions: [
        {
          q: "Hvad er Auto-Dispatch AI?",
          a: "Auto-Dispatch er vores AI-drevne flådefordelingssystem. Det analyserer søgemønstre, efterspørgsel og dine køretøjers placering for at anbefale, hvor du bør flytte biler hen for at maksimere udlejning."
        },
        {
          q: "Hvordan virker AI-anbefalingerne?",
          a: "Systemet ser på historiske bookinger, aktuelle søgninger efter lokation og biltype, samt dine ledige køretøjer. Du får konkrete anbefalinger som 'Flyt VW Golf fra København til Aarhus - forventet 1.500 kr ekstra indtægt'."
        },
        {
          q: "Skal jeg følge AI-anbefalingerne?",
          a: "Nej, anbefalingerne er kun forslag. Du kan acceptere eller afvise hver anbefaling. Systemet lærer over tid af dine valg og bliver bedre til at give relevante forslag."
        },
        {
          q: "Kan jeg se efterspørgslen i forskellige områder?",
          a: "Ja! I Flåde AI-fanen kan du se en oversigt over søgeaktivitet fordelt på lokationer og køretøjstyper. Dette hjælper dig med at forstå, hvor der er størst efterspørgsel."
        },
        {
          q: "Hvad koster AI-funktionerne?",
          a: "AI-funktionerne er inkluderet i dit LEJIO-abonnement uden ekstra omkostninger."
        }
      ]
    },
    {
      title: "Service & Vedligeholdelse",
      icon: Wrench,
      questions: [
        {
          q: "Hvordan holder jeg styr på serviceintervaller?",
          a: "I Service-fanen kan du indstille serviceintervaller baseret på kilometer og tid. Systemet advarer dig automatisk, når et køretøj nærmer sig service."
        },
        {
          q: "Hvad er Service-Logistik funktionen?",
          a: "Service-Logistik giver dig en opgaveliste med planlagte services, dækskift, syn og andre vedligeholdelsesopgaver. Du kan oprette opgaver manuelt eller lade systemet foreslå dem baseret på kørte kilometer."
        },
        {
          q: "Kan jeg få påmindelser om syn?",
          a: "Ja! Når du indtaster næste synsdato på et køretøj, får du automatisk påmindelser 30 dage og 7 dage før. Køretøjer med udløbet syn markeres som 'spærret' og kan ikke udlejes."
        },
        {
          q: "Hvordan registrerer jeg udført service?",
          a: "Gå til Service-fanen, find køretøjet, og klik 'Log service'. Indtast kilometerstand, servicetype, omkostninger og hvem der udførte servicen. Dette nulstiller serviceintervallet."
        },
        {
          q: "Understøtter I dækhotel-funktion?",
          a: "Ja! Du kan registrere, hvilken dæktype hver bil kører på (sommer/vinter/helårs), dækstørrelse og dækhotel-lokation. Systemet kan minde dig om dækskift ved sæsonskift."
        }
      ]
    },
    {
      title: "Dynamisk Selvrisiko",
      icon: Percent,
      questions: [
        {
          q: "Hvad er dynamisk selvrisiko?",
          a: "Dynamisk selvrisiko lader dig oprette forskellige selvrisikoniveauer baseret på lejerens profil. Erfarne lejere med gode ratings kan tilbydes lavere selvrisiko, mens nye lejere får standard selvrisiko."
        },
        {
          q: "Hvordan opretter jeg selvrisikoeprofiler?",
          a: "Gå til Selvrisiko-fanen i dit dashboard. Her kan du oprette profiler med forskellige niveauer: Basis (f.eks. 10.000 kr), Standard (5.000 kr) og Premium (2.500 kr) med tilhørende daglige præmier."
        },
        {
          q: "Hvordan kvalificerer lejere sig til lavere selvrisiko?",
          a: "Du kan sætte krav som minimum antal gennemførte bookinger, minimum rating (f.eks. 4.5 stjerner), eller maksimum bilværdi. Systemet matcher automatisk lejere med den rigtige profil."
        },
        {
          q: "Kan lejere købe nedsat selvrisiko?",
          a: "Ja! Ved booking kan lejere vælge at betale en daglig præmie for at reducere selvrisikoen. F.eks. 79 kr/dag for at reducere fra 10.000 kr til 2.500 kr selvrisiko."
        },
        {
          q: "Hvad sker der ved skade?",
          a: "Ved skade gælder den selvrisiko, som lejeren har valgt/kvalificeret sig til. Dette registreres automatisk på bookingen og fremgår af kontrakten."
        }
      ]
    },
    {
      title: "Tab af Indtægt",
      icon: TrendingDown,
      questions: [
        {
          q: "Hvad er Tab af Indtægt-funktionen?",
          a: "Når et køretøj er ude af drift pga. skade eller reparation, kan du beregne det potentielle indtægtstab. Systemet bruger historiske data til at estimere, hvad du ville have tjent."
        },
        {
          q: "Hvordan beregnes tabet?",
          a: "Systemet kigger på de seneste 20 bookinger og beregner gennemsnitlig dagspris og udnyttelsesgrad. Tabet beregnes som: Dagspris × Dage ude af drift × Udnyttelsesgrad."
        },
        {
          q: "Hvornår kan jeg bruge denne funktion?",
          a: "Du kan bruge den når som helst et køretøj er på værksted. Ved registrering af alvorlige skader ved indlevering, får du automatisk mulighed for at beregne tabet direkte fra skadesrapporten."
        },
        {
          q: "Kan jeg indsende krav til forsikringen?",
          a: "Ja! Når tabet er beregnet, kan du klikke 'Indsend krav' for at markere det til forsikringssag. Du kan følge status fra 'Beregnet' til 'Indsendt' til 'Godkendt' til 'Udbetalt'."
        },
        {
          q: "Er beregningen juridisk bindende?",
          a: "Nej, beregningen er et estimat til brug ved forsikringssager og interne beslutninger. Den faktiske erstatning afhænger af din forsikringspolice og forsikringsselskabets vurdering."
        }
      ]
    },
    {
      title: "Messenger & Kommunikation",
      icon: Languages,
      questions: [
        {
          q: "Hvordan fungerer beskedsystemet?",
          a: "Du kan kommunikere direkte med lejere og udlejere via vores beskedsystem. Alle beskeder gemmes sikkert og kan bruges som dokumentation ved eventuelle tvister."
        },
        {
          q: "Kan jeg vedhæfte filer til beskeder?",
          a: "Ja! Du kan vedhæfte billeder, PDF'er og dokumenter op til 10 MB. Dette er nyttigt til at dele kørekort, kontrakter eller skadesbilleder."
        },
        {
          q: "Hvordan virker oversættelsesfunktionen?",
          a: "Modtager du beskeder på et andet sprog, kan du trykke på oversæt-ikonet (🌐) for at få beskeden oversat til dansk med AI. Systemet registrerer også det originale sprog."
        },
        {
          q: "Understøtter I flere sprog?",
          a: "Ja! Vores AI-oversættelse kan oversætte fra de fleste sprog til dansk, hvilket gør det nemt at kommunikere med internationale lejere og turister."
        },
        {
          q: "Hvordan kontakter jeg kundeservice?",
          a: "Tryk på 'Kontakt kundeservice' i beskedsystemet for at starte en samtale med LEJIO's supportteam. Vi svarer typisk inden for et par timer."
        }
      ]
    },
    {
      title: "Betaling & priser",
      icon: CreditCard,
      questions: [
        {
          q: "Hvilke betalingsmetoder accepteres?",
          a: "Udlejere kan vælge at acceptere kort (via Stripe, Quickpay, PensoPay, Reepay eller OnPay), bankoverførsel, MobilePay eller kontant. Det fremgår af den enkelte udlejers profil."
        },
        {
          q: "Er der skjulte gebyrer?",
          a: "Nej, alle priser er transparente. Udlejerens pris vises tydeligt, og eventuelle tillæg som depositum eller brændstofpolitik fremgår også."
        },
        {
          q: "Hvordan fungerer månedlig betaling?",
          a: "Nogle udlejere tilbyder månedlig betaling for længerevarende lejeaftaler. Betalingen trækkes automatisk hver måned via udlejerens betalingsgateway."
        },
        {
          q: "Hvad sker der med depositummet?",
          a: "Depositummet returneres efter lejeperioden, hvis bilen afleveres i samme stand som ved modtagelse. Eventuelle skader eller manglende brændstof fratrækkes."
        }
      ]
    },
    {
      title: "Kontrakter & juridisk",
      icon: FileText,
      questions: [
        {
          q: "Hvordan fungerer lejekontrakten?",
          a: "Når en booking bekræftes, genereres en lejekontrakt automatisk. Både lejer og udlejer skal underskrive digitalt, før udlejningen kan begynde."
        },
        {
          q: "Hvad er vanvidskørselsklausulen?",
          a: "Lejere accepterer fuldt økonomisk ansvar for køretøjets værdi, hvis skade skyldes vanvidskørsel eller groft uagtsom kørsel. Dette gælder uanset forsikringsdækning."
        },
        {
          q: "Hvem er ansvarlig for bøder under lejeperioden?",
          a: "Lejeren er ansvarlig for alle bøder, parkeringsafgifter og andre afgifter pådraget i lejeperioden."
        },
        {
          q: "Hvad dækker udlejers forsikring?",
          a: "Det afhænger af udlejers forsikringspolice. Detaljer om forsikringsdækning og selvrisiko fremgår af lejekontrakten."
        }
      ]
    },
    {
      title: "Sikkerhed & advarsler",
      icon: Shield,
      questions: [
        {
          q: "Hvordan beskytter LEJIO mig som udlejer?",
          a: "Vores advarselssystem giver dig indblik i potentielle problematiske lejere. Du kan se aktive advarsler før du accepterer en booking."
        },
        {
          q: "Hvordan klager jeg over en advarsel?",
          a: "Hvis du har modtaget en advarsel, kan du klikke på linket i notifikations-e-mailen for at indgive en klage. LEJIO's administration behandler alle klager."
        },
        {
          q: "Hvad sker der ved en tvist mellem lejer og udlejer?",
          a: "Vi opfordrer til dialog mellem parterne. Hvis det ikke lykkes, kan du kontakte vores kundeservice via beskedsystemet. Alvorlige tvister kan indbringes for Forbrugerklagenævnet."
        },
        {
          q: "Hvordan rapporterer jeg en udlejer?",
          a: "Du kan indgive en klage mod en udlejer via din booking eller kontakte vores kundeservice. Vi undersøger alle henvendelser."
        }
      ]
    },
    {
      title: "Teknisk hjælp",
      icon: HelpCircle,
      questions: [
        {
          q: "Jeg kan ikke logge ind - hvad gør jeg?",
          a: "Prøv at nulstille din adgangskode via 'Glemt adgangskode' på login-siden. Hvis problemet fortsætter, kontakt vores kundeservice."
        },
        {
          q: "Hvordan ændrer jeg mine profiloplysninger?",
          a: "Gå til 'Indstillinger' i din dashboard, hvor du kan opdatere kontaktoplysninger, betalingsmetoder og forsikringsdetaljer."
        },
        {
          q: "Hvordan sletter jeg min konto?",
          a: "Kontakt vores kundeservice for at slette din konto. Bemærk at visse data skal opbevares i henhold til bogføringsloven."
        },
        {
          q: "Hvordan kontakter jeg kundeservice?",
          a: "Du kan bruge beskedsystemet til at starte en samtale med kundeservice, eller sende en e-mail til hej@lejio.dk."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Ofte stillede spørgsmål
            </h1>
            <p className="text-lg text-muted-foreground">
              Find svar på de mest almindelige spørgsmål om LEJIO
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {category.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border border-border rounded-xl px-4 data-[state=open]:bg-muted/50"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Fandt du ikke svaret?
            </h3>
            <p className="text-muted-foreground mb-4">
              Kontakt vores kundeservice - vi hjælper gerne!
            </p>
            <a 
              href="mailto:hej@lejio.dk" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Kontakt os
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;