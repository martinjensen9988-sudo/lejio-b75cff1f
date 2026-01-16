import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Car, 
  User, 
  CreditCard, 
  Shield, 
  FileText, 
  HelpCircle, 
  Bot, 
  Wrench, 
  TrendingDown, 
  Languages, 
  Percent,
  Store,
  Camera,
  Receipt,
  MapPin,
  Bike,
  Gift,
  Building2,
  BarChart3
} from "lucide-react";

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
        },
        {
          q: "Kan jeg bruge en rabatkode?",
          a: "Ja! Hvis du har en rabatkode, kan du indtaste den ved booking. Rabatten trækkes automatisk fra den samlede pris."
        },
        {
          q: "Hvad er henvisningsprogrammet?",
          a: "Når du henviser en ven til LEJIO, får I begge 500 kr. i kredit. Del din personlige henvisningskode, og få kredit når din ven gennemfører sin første booking."
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
        },
        {
          q: "Kan jeg have flere udlejningslokationer?",
          a: "Ja! Som forhandler kan du oprette flere lokationer med individuelle adresser, åbningstider og kontaktinfo. Hver lokation kan have egne køretøjer tilknyttet."
        },
        {
          q: "Hvordan fungerer sæsonpriser?",
          a: "Du kan indstille forskellige priser for høj- og lavsæson. Systemet skifter automatisk mellem priserne baseret på de datoer, du definerer."
        }
      ]
    },
    {
      title: "Lokationer & Afdelinger",
      icon: Store,
      questions: [
        {
          q: "Hvordan opretter jeg en ny lokation?",
          a: "Gå til 'Lokationer' i dit dashboard og klik 'Tilføj lokation'. Indtast navn, adresse, telefon, email og åbningstider. Du kan også angive forberedelsestid mellem bookinger."
        },
        {
          q: "Hvad er forberedelsestid?",
          a: "Forberedelsestid er den tid du skal bruge til at klargøre bilen mellem to bookinger (rengøring, tankning, tjek). Du kan indstille dette individuelt for hver lokation."
        },
        {
          q: "Kan lejere vælge afhentningslokation?",
          a: "Ja! Ved booking kan lejere se alle dine aktive lokationer og vælge, hvor de vil afhente og aflevere bilen. Lokationsinfo inkluderes automatisk i kontrakten."
        },
        {
          q: "Hvordan tilknytter jeg biler til lokationer?",
          a: "Ved oprettelse eller redigering af et køretøj kan du vælge, hvilken lokation bilen tilhører. Dette hjælper med overblik og vises til lejere ved søgning."
        },
        {
          q: "Kan jeg have forskellige åbningstider pr. lokation?",
          a: "Ja! Hver lokation kan have sine egne åbningstider og særlige lukkedage. Dette påvirker, hvornår lejere kan afhente og aflevere."
        }
      ]
    },
    {
      title: "Check-in & Check-out",
      icon: Camera,
      questions: [
        {
          q: "Hvordan fungerer nummerplade-scanning?",
          a: "Ved udlevering og aflevering scanner du bilens nummerplade med kameraet. Systemet verificerer automatisk, at det er den rigtige bil og registrerer tidspunktet."
        },
        {
          q: "Hvad er dashboard-foto med AI?",
          a: "Tag et foto af instrumentbrættet ved check-in og check-out. Vores AI aflæser automatisk kilometerstand og brændstofniveau, så du slipper for manuel indtastning."
        },
        {
          q: "Hvad er GPS-lokationsverifikation?",
          a: "Ved aflevering kan systemet tjekke, om bilen befinder sig på den aftalte lokation. Du får en advarsel, hvis bilen afleveres et forkert sted."
        },
        {
          q: "Hvordan beregnes km-overskridelse?",
          a: "Systemet sammenligner start- og slut-kilometertal med det inkluderede antal km på kontrakten. Overskridelser ganges med den aftalte km-pris og tilføjes automatisk til opgørelsen."
        },
        {
          q: "Hvad er QR-kode check-in?",
          a: "Du kan generere en QR-kode, som lejeren scanner ved afhentning. Dette starter check-in processen automatisk og gør selv-check-in muligt uden fysisk overdragelse."
        },
        {
          q: "Hvordan dokumenterer jeg bilens stand?",
          a: "Brug skaderapport-funktionen til at fotografere og markere eksisterende skader på et visuelt diagram af bilen. Begge parter godkender rapporten digitalt."
        }
      ]
    },
    {
      title: "Bøder & Afgifter",
      icon: Receipt,
      questions: [
        {
          q: "Hvordan sender jeg en bøde videre til lejeren?",
          a: "Gå til 'Bøder' i dit dashboard, upload bøden som PDF eller foto, og vælg det relevante køretøj og dato. Systemet finder automatisk den rette booking."
        },
        {
          q: "Kan jeg tage et administrationsgebyr?",
          a: "Ja! Du kan indstille et gebyr fra 0-800 kr, som lægges oven i bødens beløb. Dette dækker din tid til at håndtere bøden og kommunikere med lejeren."
        },
        {
          q: "Hvordan ved lejeren, at de har fået en bøde?",
          a: "Lejeren modtager automatisk en email med bødedetaljer, dokumentation og betalingsinstruktioner. Du kan følge status fra 'Afventer' til 'Betalt' i systemet."
        },
        {
          q: "Hvad hvis lejeren bestrider bøden?",
          a: "Kommuniker med lejeren via beskedsystemet. Har du dokumentation fra check-in/check-out, kan denne bruges som bevis. Ved alvorlige tvister kan LEJIO mægle."
        },
        {
          q: "Hvilke typer afgifter kan jeg registrere?",
          a: "Du kan registrere fartbøder, parkeringsbøder, brobizz-afgifter, P-afgifter og andre trafikrelaterede afgifter. Hver type får sin egen kategori."
        }
      ]
    },
    {
      title: "GPS & Flådestyring",
      icon: MapPin,
      questions: [
        {
          q: "Hvordan forbinder jeg en GPS-tracker?",
          a: "Gå til 'GPS-sporing' i dit dashboard og tilføj din GPS-enhed. Vi understøtter de fleste GPS-udbydere via webhook-integration. Du får en unik webhook-URL til din tracker."
        },
        {
          q: "Hvad er geofencing?",
          a: "Geofencing lader dig definere et område på kortet. Du får automatisk besked, når en bil kører ind i eller ud af området – nyttigt ved landeoverskridende kørsel."
        },
        {
          q: "Kan jeg se bilernes position i realtid?",
          a: "Ja! GPS-kortet viser alle dine biler med aktuel position, hastighed og retning. Du kan klikke på en bil for at se historik og detaljer."
        },
        {
          q: "Opdateres kilometertallet automatisk?",
          a: "Ja, hvis din GPS-tracker sender kilometerdata, opdateres køretøjets kilometertal automatisk. Dette bruges til serviceintervaller og check-in/check-out."
        },
        {
          q: "Hvilke GPS-udbydere understøttes?",
          a: "Vi understøtter alle GPS-udbydere der kan sende data via webhook (HTTP POST). Det inkluderer bl.a. Teltonika, Ruptela, Concox og mange andre. Kontakt os for hjælp til opsætning."
        }
      ]
    },
    {
      title: "Motorcykel & Scooter",
      icon: Bike,
      questions: [
        {
          q: "Hvordan validerer LEJIO MC-kørekort?",
          a: "Ved booking af motorcykler tjekker systemet automatisk lejerens kørekorttype (A1, A2, A) mod motorcyklens effekt. Er kørekortet ikke tilstrækkeligt, afvises bookingen."
        },
        {
          q: "Hvad er MC-specifik vedligeholdelse?",
          a: "Ud over standard service kan du spore MC-specifikke ting som kædeservice, dækslid, bremseklodser og væskestand. Systemet minder dig, når det er tid til vedligeholdelse."
        },
        {
          q: "Hvad er sæson-tjeklisten?",
          a: "Om foråret og efteråret får du automatiske påmindelser om at gøre motorcyklerne klar til sæsonen – batteritjek, dækskift, væskestand og generel gennemgang."
        },
        {
          q: "Er der særlig check-in for motorcykler?",
          a: "Ja! MC Check-in guiden fokuserer på MC-specifikke kontrolpunkter som kæde, dæk, bremser, lys og udstyr (hjelm, handsker). Dette sikrer grundig dokumentation."
        },
        {
          q: "Kan jeg leje scootere ud via LEJIO?",
          a: "Absolut! Scootere og knallerter håndteres på samme måde som motorcykler, med passende kørekortvalidering (AM/A1) afhængig af scooterens specifikationer."
        }
      ]
    },
    {
      title: "Henvisning & Rabatter",
      icon: Gift,
      questions: [
        {
          q: "Hvordan fungerer henvisningsprogrammet?",
          a: "Del din personlige henvisningskode med venner. Når de opretter sig og gennemfører en booking, får I begge 500 kr. i kredit, som kan bruges på fremtidige bookinger."
        },
        {
          q: "Hvordan finder jeg min henvisningskode?",
          a: "Gå til 'Indstillinger' og find afsnittet 'Henvisning'. Her ser du din unikke kode og kan dele den direkte på sociale medier eller via SMS."
        },
        {
          q: "Hvornår kan jeg bruge min kredit?",
          a: "Kredit tildeles, når den henviste person gennemfører sin første booking. Du kan derefter bruge kreditten på din næste booking – den trækkes automatisk fra."
        },
        {
          q: "Hvordan opretter jeg rabatkoder som udlejer?",
          a: "Gå til 'Rabatkoder' i dit dashboard. Opret koder med procentrabat eller fast beløb, sæt gyldighedsperiode og maksimalt antal brug. Del koderne med dine kunder."
        },
        {
          q: "Kan rabatkoder kombineres med henvisningskredit?",
          a: "Ja! En lejer kan både bruge en rabatkode og sin optjente henvisningskredit på samme booking for maksimal besparelse."
        }
      ]
    },
    {
      title: "Erhverv & Flåde",
      icon: Building2,
      questions: [
        {
          q: "Hvad er en erhvervskonto?",
          a: "Erhvervskonti giver virksomheder særlige vilkår: månedlig samlet faktura, EAN-understøttelse, afdelingsbudgetter og mulighed for at administrere flere medarbejderes adgang."
        },
        {
          q: "Hvordan oprettes afdelingsbudgetter?",
          a: "Som erhvervskunde kan du oprette afdelinger med separate budgetter. Når medarbejdere booker, allokeres udgiften til deres afdeling, og du kan trække rapporter pr. afdeling."
        },
        {
          q: "Kan medarbejdere booke selv?",
          a: "Ja! Du inviterer medarbejdere til erhvervskontoen, og de kan herefter selv booke biler inden for deres afdelings budget og regler. Alt samles på virksomhedens faktura."
        },
        {
          q: "Hvad er flåde-afregning?",
          a: "Store flådeejere kan få månedlig afregning med kommission i stedet for pr. booking gebyr. Kontakt os for at høre om betingelserne."
        },
        {
          q: "Understøtter I EAN-fakturering?",
          a: "Ja! Erhvervskunder kan angive EAN-nummer, og alle fakturaer sendes automatisk via EAN til jeres økonomisystem."
        },
        {
          q: "Hvad er CVR-opslag?",
          a: "Når du indtaster et CVR-nummer, henter systemet automatisk virksomhedsoplysninger som navn, adresse og kontaktinfo fra CVR-registeret."
        }
      ]
    },
    {
      title: "Statistik & Rapporter",
      icon: BarChart3,
      questions: [
        {
          q: "Hvilke statistikker kan jeg se?",
          a: "Du får overblik over indtjening, antal bookinger, udnyttelsesgrad, gennemsnitlig dagspris og mest populære køretøjer – alt fordelt på perioder og køretøjer."
        },
        {
          q: "Hvad er udnyttelsesgrad?",
          a: "Udnyttelsesgraden viser, hvor mange dage dine biler har været udlejet i forhold til tilgængelige dage. 80% udnyttelse betyder, at bilen var lejet ud 80% af tiden."
        },
        {
          q: "Kan jeg eksportere data til regnskab?",
          a: "Ja! Du kan downloade månedlige rapporter som PDF eller Excel med alle bookinger, indtægter og gebyrer – perfekt til bogføring og SKAT."
        },
        {
          q: "Hvad er AI Dashboard-analyse?",
          a: "Vores AI analyserer dine data og giver dig personlige anbefalinger: prisjusteringer, optimale lokationer, populære perioder og forslag til at øge din indtjening."
        },
        {
          q: "Kan jeg se udvikling over tid?",
          a: "Ja! Grafer viser din indtjening, bookinger og udnyttelse over tid. Sammenlign måneder og år for at se, hvordan din forretning udvikler sig."
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
        },
        {
          q: "Hvad er km-trigger opgaver?",
          a: "Du kan oprette opgaver der automatisk aktiveres, når et køretøj når et bestemt kilometertal – f.eks. 'Kædeskift ved 15.000 km' for motorcykler."
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
        },
        {
          q: "Får jeg notifikationer ved nye beskeder?",
          a: "Ja! Du får push-notifikationer på telefonen og kan se antal ulæste beskeder i menuen. Du kan indstille notifikationer i dine indstillinger."
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
        },
        {
          q: "Hvordan fungerer platformgebyr-betaling?",
          a: "Som udlejer kan du se og betale dine platformgebyrer direkte i dashboardet. Du får oversigt over afventende gebyrer og kan betale samlet eller enkeltvis."
        },
        {
          q: "Hvad er AI-prissætning?",
          a: "Vores AI analyserer markedet, sæson og efterspørgsel og giver dig prisanbefalinger. Du kan se foreslået pris og begrundelse, men bestemmer altid selv den endelige pris."
        }
      ]
    },
    {
      title: "Kontrakter & Dokumentation",
      icon: FileText,
      questions: [
        {
          q: "Hvordan fungerer lejekontrakten?",
          a: "Når en booking bekræftes, genereres en lejekontrakt automatisk med alle detaljer: køretøj, periode, pris, selvrisiko, forsikring og vilkår. Både lejer og udlejer skal underskrive digitalt."
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
        },
        {
          q: "Kan jeg uploade mit firmalogo til kontrakterne?",
          a: "Ja! Som forhandler kan du uploade dit firmalogo i indstillinger. Logoet vises øverst på alle dine kontrakter for professionelt udseende."
        },
        {
          q: "Hvad er skaderapporter med AI?",
          a: "Ved check-in og check-out kan du fotografere bilen. Vores AI analyserer billederne og kan identificere skader automatisk. Du markerer skaderne på et visuelt diagram, og begge parter godkender."
        }
      ]
    },
    {
      title: "Sikkerhed & Advarsler",
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
          a: "Vi opfordrer til dialog mellem parterne via beskedsystemet. Hvis det ikke lykkes, kan du kontakte vores kundeservice. Alvorlige tvister kan indbringes for Forbrugerklagenævnet."
        },
        {
          q: "Hvordan rapporterer jeg en udlejer?",
          a: "Du kan indgive en klage mod en udlejer via din booking eller kontakte vores kundeservice. Vi undersøger alle henvendelser."
        },
        {
          q: "Hvordan verificeres kørekort?",
          a: "Lejere uploader billede af deres kørekort. Vores AI verificerer ægthed og udløbsdato. Udlejere kan se verifikationsstatus før de accepterer bookinger."
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
        },
        {
          q: "Fungerer LEJIO på mobil?",
          a: "Ja! LEJIO er fuldt responsivt og fungerer på alle enheder. Du kan også installere LEJIO som app på din telefon via browseren for hurtig adgang."
        },
        {
          q: "Hvad gør jeg, hvis en funktion ikke virker?",
          a: "Prøv først at genindlæse siden. Hvis problemet fortsætter, kontakt kundeservice med en beskrivelse af fejlen, så hjælper vi dig hurtigt."
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