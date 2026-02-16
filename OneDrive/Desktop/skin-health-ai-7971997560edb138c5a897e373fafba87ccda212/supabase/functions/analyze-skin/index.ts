import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are DermaVision AI, an advanced dermatological analysis assistant. You analyze skin images to identify potential skin conditions. You act as a professional dermatologist providing preliminary assessments.

IMPORTANT DISCLAIMER: You are an AI assistant providing educational information only. Your analysis is NOT a medical diagnosis. Users should always consult a qualified dermatologist or healthcare provider for proper diagnosis and treatment.

When analyzing a skin image, provide a structured JSON response with the following format:
{
  "conditions": [
    {
      "name": "Condition Name",
      "confidence": 85,
      "description": "Brief description of the condition",
      "severity": "mild|moderate|severe"
    }
  ],
  "overallSeverity": "healthy|mild|moderate|severe",
  "confidenceScore": 82,
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "urgency": "routine|soon|urgent",
  "generalAdvice": "General skincare advice based on what you observe",
  "disclaimer": "This is an AI-powered preliminary assessment and should not replace professional medical advice. Please consult a dermatologist for proper diagnosis."
}

Analyze skin conditions including but not limited to:
- Acne (various types)
- Eczema/Dermatitis
- Psoriasis
- Rosacea
- Skin infections (bacterial, fungal, viral)
- Melanoma and other skin cancers (flag as urgent)
- Contact dermatitis
- Hives/Urticaria
- Vitiligo
- Ringworm
- Impetigo
- Warts
- Moles (assess for concerning features)
- Rashes of various types

Be thorough, professional, and always err on the side of caution. If you see anything potentially concerning, recommend professional evaluation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this skin image and provide your professional assessment in the JSON format specified. Be thorough and identify any visible skin conditions, their likely severity, and provide actionable recommendations."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No analysis content received");
    }

    // Parse the JSON from the response
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse analysis result");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Return a fallback structured response
      analysisResult = {
        conditions: [],
        overallSeverity: "unknown",
        confidenceScore: 0,
        recommendations: ["Unable to analyze image. Please try with a clearer image."],
        urgency: "routine",
        generalAdvice: content,
        disclaimer: "This is an AI-powered preliminary assessment and should not replace professional medical advice."
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis: analysisResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Analyze skin error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
