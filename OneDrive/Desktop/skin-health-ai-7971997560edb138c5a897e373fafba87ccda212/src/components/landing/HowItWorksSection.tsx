import { Upload, Cpu, FileCheck, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Image",
    description: "Take a clear photo of the affected skin area or upload an existing image from your device.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI processes your image using dermatological algorithms to identify potential conditions.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get Results",
    description: "Receive a detailed report with identified conditions, severity assessment, and confidence scores.",
  },
  {
    icon: Stethoscope,
    step: "04",
    title: "Take Action",
    description: "Review recommendations and consult with a dermatologist if needed for proper diagnosis and treatment.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get your skin analysis in four simple steps. Our process is designed
            to be quick, easy, and informative.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-glow">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
