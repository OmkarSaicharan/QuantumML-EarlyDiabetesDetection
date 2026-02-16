import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Camera, AlertCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  created_at: string;
  conditions_detected: string[];
  severity_level: string;
  confidence_score: number;
  recommendations: string[];
}

const severityConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  healthy: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  mild: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  moderate: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  severe: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("skin_analyses")
        .select("id, created_at, conditions_detected, severity_level, confidence_score, recommendations")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase.from("skin_analyses").delete().eq("id", id);
      if (error) throw error;
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Analysis deleted");
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast.error("Failed to delete analysis");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
              <p className="text-muted-foreground">
                View your past skin analyses and track changes over time
              </p>
            </div>
            <Button onClick={() => navigate("/analyze")} className="gap-2">
              <Camera className="h-4 w-4" />
              New Analysis
            </Button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No analyses yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first skin image
              </p>
              <Button onClick={() => navigate("/analyze")}>
                Start Your First Analysis
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const severity = severityConfig[item.severity_level] || severityConfig.mild;
                const SeverityIcon = severity.icon;

                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        <Badge className={severity.color}>
                          <SeverityIcon className="h-3 w-3 mr-1" />
                          {item.severity_level || "Unknown"}
                        </Badge>
                        <Badge variant="outline">{item.confidence_score}% confidence</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAnalysis(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.conditions_detected && item.conditions_detected.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Conditions Detected:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.conditions_detected.map((condition, idx) => (
                            <Badge key={idx} variant="secondary">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.recommendations && item.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Recommendations:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {item.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="truncate">
                              • {rec}
                            </li>
                          ))}
                          {item.recommendations.length > 2 && (
                            <li className="text-primary">
                              +{item.recommendations.length - 2} more recommendations
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
