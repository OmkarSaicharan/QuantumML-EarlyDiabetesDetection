import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Condition {
  name: string;
  confidence: number;
  description: string;
  severity: "mild" | "moderate" | "severe";
}

interface AnalysisResult {
  conditions: Condition[];
  overallSeverity: "healthy" | "mild" | "moderate" | "severe" | "unknown";
  confidenceScore: number;
  recommendations: string[];
  urgency: "routine" | "soon" | "urgent";
  generalAdvice: string;
  disclaimer: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

const severityConfig = {
  healthy: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    label: "Healthy",
    iconColor: "text-green-600",
  },
  mild: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
    label: "Mild",
    iconColor: "text-yellow-600",
  },
  moderate: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
    label: "Moderate",
    iconColor: "text-orange-600",
  },
  severe: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Severe",
    iconColor: "text-red-600",
  },
  unknown: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertCircle,
    label: "Unknown",
    iconColor: "text-gray-600",
  },
};

const urgencyConfig = {
  routine: {
    color: "bg-green-50 border-green-200",
    text: "Routine follow-up recommended",
  },
  soon: {
    color: "bg-yellow-50 border-yellow-200",
    text: "Consider scheduling an appointment soon",
  },
  urgent: {
    color: "bg-red-50 border-red-200",
    text: "Prompt medical evaluation recommended",
  },
};

export function AnalysisResults({ result, onNewAnalysis }: AnalysisResultsProps) {
  const severityInfo = severityConfig[result.overallSeverity] || severityConfig.unknown;
  const SeverityIcon = severityInfo.icon;
  const urgencyInfo = urgencyConfig[result.urgency] || urgencyConfig.routine;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Summary Card */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Analysis Results</h3>
          <Badge className={severityInfo.color}>
            <SeverityIcon className={`h-4 w-4 mr-1 ${severityInfo.iconColor}`} />
            {severityInfo.label}
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-medium">{result.confidenceScore}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${result.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Urgency Banner */}
        <div className={`p-4 rounded-xl border ${urgencyInfo.color} mb-6`}>
          <p className="font-medium">{urgencyInfo.text}</p>
        </div>

        {/* General Advice */}
        {result.generalAdvice && (
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">{result.generalAdvice}</p>
          </div>
        )}
      </div>

      {/* Detected Conditions */}
      {result.conditions && result.conditions.length > 0 && (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Detected Conditions
          </h3>
          <div className="space-y-4">
            {result.conditions.map((condition, index) => {
              const condSeverity = severityConfig[condition.severity] || severityConfig.mild;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{condition.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={condSeverity.color}>
                        {condition.severity}
                      </Badge>
                      <Badge variant="outline">{condition.confidence}%</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{condition.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Important Disclaimer</h4>
            <p className="text-sm text-muted-foreground">{result.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onNewAnalysis} className="flex-1">
          Analyze Another Image
        </Button>
      </div>
    </div>
  );
}
