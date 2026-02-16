import { Camera, Brain, FileText, Clock, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Easy Photo Upload",
    description: "Capture directly with your camera or upload existing photos. Our AI works with any clear skin image.",
  },
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "Powered by state-of-the-art vision models trained on dermatological datasets for accurate assessments.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Receive comprehensive analysis including condition identification, severity levels, and recommendations.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get your preliminary assessment in seconds, not days. Perfect for quick peace of mind.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your images and data are encrypted and never shared. We prioritize your privacy.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Access DermaVision from any device - desktop, tablet, or mobile. Analyze anytime, anywhere.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose <span className="gradient-text">DermaVision</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI dermatologist combines cutting-edge technology with medical expertise
            to provide you with reliable preliminary skin assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl card-gradient border border-border/50 shadow-soft hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
