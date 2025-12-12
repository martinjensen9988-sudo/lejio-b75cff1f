import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCVRLookup } from "@/hooks/useCVRLookup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LejioLogo from "@/components/LejioLogo";
import { toast } from "sonner";
import { z } from "zod";
import { User, Building2, ArrowLeft, ArrowRight, Check, Mail, Lock, Phone, MapPin, Loader2 } from "lucide-react";

// Validation schemas
const emailSchema = z.string().email("Ugyldig email adresse").max(255);
const passwordSchema = z.string().min(8, "Adgangskode skal være mindst 8 tegn").max(128);
const nameSchema = z.string().min(2, "Navn skal være mindst 2 tegn").max(100);
const cvrSchema = z.string().regex(/^\d{8}$/, "CVR-nummer skal være 8 cifre").optional().or(z.literal(''));

type AuthMode = "login" | "signup";
type UserType = "privat" | "professionel";
type SignupStep = "choose-type" | "credentials" | "profile";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("choose-type");
  const [userType, setUserType] = useState<UserType>("privat");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cvrNumber, setCvrNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { lookupCVR, isLoading: cvrLoading, error: cvrError } = useCVRLookup();

  // Auto-lookup CVR when 8 digits are entered
  useEffect(() => {
    if (userType !== 'professionel') return;
    
    const cleanCvr = cvrNumber.replace(/\D/g, '');
    if (cleanCvr.length === 8) {
      lookupCVR(cleanCvr).then((result) => {
        if (result?.companyName) {
          setCompanyName(result.companyName);
          toast.success('Virksomhed fundet!', {
            description: result.companyName,
          });
        }
      });
    }
  }, [cvrNumber, userType, lookupCVR]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const validateField = (field: string, value: string): string | null => {
    try {
      switch (field) {
        case "email":
          emailSchema.parse(value);
          break;
        case "password":
          passwordSchema.parse(value);
          break;
        case "fullName":
          nameSchema.parse(value);
          break;
        case "cvrNumber":
          if (value) cvrSchema.parse(value);
          break;
      }
      return null;
    } catch (e) {
      if (e instanceof z.ZodError) {
        return e.errors[0].message;
      }
      return "Ugyldig værdi";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      setErrors({ email: emailError || "", password: passwordError || "" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Forkert email eller adgangskode");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Velkommen tilbage!");
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate all fields
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    const nameError = validateField("fullName", fullName);
    const cvrError = userType === "professionel" ? validateField("cvrNumber", cvrNumber) : null;

    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Adgangskoderne matcher ikke" }));
      return;
    }

    if (emailError || passwordError || nameError || cvrError) {
      setErrors({
        email: emailError || "",
        password: passwordError || "",
        fullName: nameError || "",
        cvrNumber: cvrError || "",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(
      email, 
      password, 
      fullName, 
      userType,
      userType === "professionel" ? cvrNumber : undefined,
      userType === "professionel" ? companyName : undefined
    );
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("Denne email er allerede registreret. Prøv at logge ind i stedet.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Konto oprettet! Velkommen til LEJIO 🎉");
      navigate("/");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setCvrNumber("");
    setCompanyName("");
    setErrors({});
    setSignupStep("choose-type");
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
        <div className="animate-pulse text-primary text-xl">Indlæser...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
      {/* Organic blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 blob animate-blob animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/20 blob-2 animate-blob animate-float" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block cursor-pointer" onClick={() => navigate("/")}>
            <LejioLogo />
          </div>
          <p className="text-muted-foreground mt-2">
            {mode === "login" ? "Log ind på din konto" : "Opret din konto"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border-2 border-border">
          {mode === "login" ? (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.dk"
                  className="rounded-xl"
                  required
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Adgangskode
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl"
                  required
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logger ind..." : "Log ind"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Har du ikke en konto?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-primary font-semibold hover:underline"
                >
                  Opret konto
                </button>
              </p>
            </form>
          ) : (
            // SIGNUP FLOW
            <>
              {signupStep === "choose-type" && (
                // STEP 1: Choose user type (The Fork)
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Vælg din profil
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Hvad beskriver dig bedst?
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {/* Private option */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserType("privat");
                        setSignupStep("credentials");
                      }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                        userType === "privat" 
                          ? "border-accent bg-accent/10" 
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                          <User className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Privat udlejer</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Jeg vil udleje min private bil og tjene penge, når jeg ikke bruger den.
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-accent font-medium">
                            <Check className="w-4 h-4" />
                            <span>Gratis at starte • 15-20% provision</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Professional option */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserType("professionel");
                        setSignupStep("credentials");
                      }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                        userType === "professionel" 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Professionel udlejer</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Jeg har et CVR-nummer og driver en udlejningsforretning.
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-primary font-medium">
                            <Check className="w-4 h-4" />
                            <span>Egen betalingsløsning • 299 kr/md</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Har du allerede en konto?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-primary font-semibold hover:underline"
                    >
                      Log ind
                    </button>
                  </p>
                </div>
              )}

              {signupStep === "credentials" && (
                // STEP 2: Email & Password
                <form onSubmit={(e) => { e.preventDefault(); setSignupStep("profile"); }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setSignupStep("choose-type")}
                      className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {userType === "privat" ? "Privat udlejer" : "Professionel udlejer"}
                      </h2>
                      <p className="text-sm text-muted-foreground">Trin 1 af 2 - Login oplysninger</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din@email.dk"
                      className="rounded-xl"
                      required
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Adgangskode
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mindst 8 tegn"
                      className="rounded-xl"
                      required
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Bekræft adgangskode
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Gentag adgangskode"
                      className="rounded-xl"
                      required
                    />
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    variant={userType === "privat" ? "warm" : "hero"}
                    size="lg" 
                    className="w-full"
                  >
                    Fortsæt
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              )}

              {signupStep === "profile" && (
                // STEP 3: Profile info
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setSignupStep("credentials")}
                      className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {userType === "privat" ? "Privat udlejer" : "Professionel udlejer"}
                      </h2>
                      <p className="text-sm text-muted-foreground">Trin 2 af 2 - Profiloplysninger</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Fulde navn
                    </Label>
                    <Input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dit fulde navn"
                      className="rounded-xl"
                      required
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Telefon (valgfrit)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+45 12 34 56 78"
                      className="rounded-xl"
                    />
                  </div>

                  {userType === "professionel" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cvr-number" className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          CVR-nummer
                        </Label>
                        <div className="relative">
                          <Input
                            id="cvr-number"
                            type="text"
                            value={cvrNumber}
                            onChange={(e) => setCvrNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                            placeholder="12345678"
                            className="rounded-xl pr-10"
                            maxLength={8}
                            required
                          />
                          {cvrLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                        {cvrError && <p className="text-sm text-destructive">{cvrError}</p>}
                        {errors.cvrNumber && <p className="text-sm text-destructive">{errors.cvrNumber}</p>}
                        <p className="text-xs text-muted-foreground">
                          Indtast 8 cifre for automatisk virksomhedsopslag
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company-name" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Firmanavn
                        </Label>
                        <Input
                          id="company-name"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Dit firma ApS"
                          className="rounded-xl"
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    variant={userType === "privat" ? "warm" : "hero"}
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Opretter konto..." : "Opret konto 🎉"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Ved at oprette en konto accepterer du vores{" "}
                    <a href="#" className="text-primary hover:underline">vilkår</a> og{" "}
                    <a href="#" className="text-primary hover:underline">privatlivspolitik</a>.
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
