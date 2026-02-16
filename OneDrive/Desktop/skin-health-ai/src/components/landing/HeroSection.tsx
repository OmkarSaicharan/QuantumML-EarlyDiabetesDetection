import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Camera, Shield, Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Dermatology Assistant
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-slide-up">
            Professional Skin Analysis{" "}
            <span className="gradient-text">Powered by AI</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Get instant preliminary assessments for skin conditions using advanced AI technology.
            Upload a photo and receive detailed analysis with confidence scores and recommendations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to={user ? "/analyze" : "/auth?mode=signup"}>
              <Button size="lg" className="gap-2 px-8 text-base shadow-glow hover:shadow-elevated transition-shadow">
                <Camera className="h-5 w-5" />
                {user ? "Start Analysis" : "Get Started Free"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="px-8 text-base">
                {user ? "View Dashboard" : "Sign In"}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>300+ Conditions Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
