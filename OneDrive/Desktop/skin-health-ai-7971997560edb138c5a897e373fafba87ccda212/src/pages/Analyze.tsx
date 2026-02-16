import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageCapture } from "@/components/analysis/ImageCapture";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

interface AnalysisResult {
  conditions: Array<{
    name: string;
    confidence: number;
    description: string;
    severity: "mild" | "moderate" | "severe";
  }>;
  overallSeverity: "healthy" | "mild" | "moderate" | "severe" | "unknown";
  confidenceScore: number;
  recommendations: string[];
  urgency: "routine" | "soon" | "urgent";
  generalAdvice: string;
  disclaimer: string;
}

export default function AnalyzePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleImageCapture = async (imageBase64: string) => {
    setCapturedImageBase64(imageBase64);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-skin", {
        body: { imageBase64 },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data.analysis);

      // Save to history
      if (user && data.analysis) {
        const conditions = data.analysis.conditions?.map((c: any) => c.name) || [];
        await supabase.from("skin_analyses").insert({
          user_id: user.id,
          image_url: `data:image/jpeg;base64,${imageBase64.substring(0, 100)}...`, // Store reference
          analysis_result: data.analysis,
          conditions_detected: conditions,
          severity_level: data.analysis.overallSeverity,
          confidence_score: data.analysis.confidenceScore,
          recommendations: data.analysis.recommendations,
        });
      }

      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to analyze image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCapturedImageBase64(null);
  };

  if (loading) {
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Skin Analysis</h1>
            <p className="text-muted-foreground">
              Upload or capture an image of your skin concern for AI-powered analysis
            </p>
          </div>

          {analysisResult ? (
            <AnalysisResults result={analysisResult} onNewAnalysis={handleNewAnalysis} />
          ) : (
            <ImageCapture onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
