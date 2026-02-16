import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-16">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              Start Your Free Analysis
            </div>

            <h2 className="mb-6 text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Take Control of Your Skin Health?
            </h2>

            <p className="mb-10 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of users who trust DermaVision for preliminary skin assessments.
              Get instant insights powered by advanced AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/analyze" : "/auth?mode=signup"}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 px-8 text-base font-semibold"
                >
                  {user ? "Analyze Now" : "Create Free Account"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
