import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useParseResume } from "@workspace/api-client-react";
import { useResumeContext } from "@/hooks/use-resume-context";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Home() {
  const [, setLocation] = useLocation();
  const { setResume } = useResumeContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const parseResume = useParseResume({
    mutation: {
      onSuccess: (data) => {
        setResume(data);
        setLocation("/editor");
      },
      onError: () => {
        toast({
          title: "Upload failed",
          description: "There was an error parsing your resume. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF document.",
        variant: "destructive"
      });
      return;
    }
    
    parseResume.mutate({ data: { file } });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 w-full">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-tight">
            Resume Drafter
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light">
            Upload your existing resume. Get a beautifully typeset document and AI-powered ATS insights in seconds.
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className={`w-full max-w-xl p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ease-out flex flex-col items-center text-center cursor-pointer ${
            isDragging 
              ? "border-primary bg-primary/5 shadow-lg scale-[1.02]" 
              : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
            {parseResume.isPending ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : (
              <UploadCloud className="w-10 h-10" />
            )}
          </div>
          
          <h3 className="text-xl font-medium text-foreground mb-2">
            {parseResume.isPending ? "Analyzing document..." : "Drag and drop your PDF"}
          </h3>
          
          <p className="text-muted-foreground mb-6">
            or click to browse from your computer
          </p>
          
          <Button 
            size="lg" 
            className="rounded-full px-8 text-base shadow-sm"
            disabled={parseResume.isPending}
          >
            {parseResume.isPending ? "Processing..." : "Select File"}
          </Button>
          
          <div className="mt-8 flex items-center text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            <FileText className="w-4 h-4 mr-2" />
            PDF format only
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="font-semibold text-foreground">Upload</h4>
            <p className="text-sm text-muted-foreground">Drop your current, messy PDF resume.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="font-semibold text-foreground">Analyze</h4>
            <p className="text-sm text-muted-foreground">Our AI evaluates it against ATS systems.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-accent text-primary flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="font-semibold text-foreground">Export</h4>
            <p className="text-sm text-muted-foreground">Download a pristine, high-conversion PDF.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
