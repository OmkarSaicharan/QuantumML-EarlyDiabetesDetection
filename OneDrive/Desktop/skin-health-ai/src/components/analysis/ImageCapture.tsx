import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageCaptureProps {
  onImageCapture: (imageBase64: string) => void;
  isAnalyzing: boolean;
}

export function ImageCapture({ onImageCapture, isAnalyzing }: ImageCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions or upload an image instead.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        const base64 = imageData.split(",")[1];
        setCapturedImage(imageData);
        stopCamera();
        return base64;
      }
    }
    return null;
  };

  const handleCapture = () => {
    const base64 = capturePhoto();
    if (base64) {
      onImageCapture(base64);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        const base64 = result.split(",")[1];
        onImageCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Captured Image Preview */}
      {capturedImage ? (
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
            <img
              src={capturedImage}
              alt="Captured skin"
              className="w-full max-h-96 object-contain bg-muted"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">Analyzing your image...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              </div>
            )}
          </div>
          {!isAnalyzing && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4"
              onClick={resetCapture}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake
            </Button>
          )}
        </div>
      ) : isCameraActive ? (
        /* Camera View */
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-card bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-96 object-contain"
          />
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={stopCamera}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleCapture} className="px-8">
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload/Camera Options */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={startCamera}
            className="group relative p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary transition-colors text-center"
          >
            <div className="mb-4 mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Camera className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Use Camera</h3>
            <p className="text-sm text-muted-foreground">
              Take a photo directly using your device's camera
            </p>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary transition-colors text-center"
          >
            <div className="mb-4 mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Upload className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
            <p className="text-sm text-muted-foreground">
              Select an existing photo from your device
            </p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Tips */}
      {!capturedImage && !isCameraActive && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <h4 className="font-medium text-sm mb-2 text-primary">📸 Tips for Best Results</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use good lighting - natural daylight works best</li>
            <li>• Keep the camera steady and in focus</li>
            <li>• Center the affected area in the frame</li>
            <li>• Avoid shadows or glare on the skin</li>
          </ul>
        </div>
      )}
    </div>
  );
}
