import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useResumeContext } from "@/hooks/use-resume-context";
import { useGetTemplates, useAnalyzeResume, getGetTemplatesQueryKey, ResumeAnalysis } from "@workspace/api-client-react";
import { TemplateRenderer } from "@/components/template-renderer";
import { PdfExporter } from "@/components/pdf-exporter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, LayoutTemplate, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Editor() {
  const [, setLocation] = useLocation();
  const { resume } = useResumeContext();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Redirect to home if no resume data
  useEffect(() => {
    if (!resume) {
      setLocation("/");
    }
  }, [resume, setLocation]);

  const { data: templates, isLoading: isLoadingTemplates } = useGetTemplates({
    query: { queryKey: getGetTemplatesQueryKey() }
  });

  const analyzeResume = useAnalyzeResume({
    mutation: {
      onSuccess: (data) => {
        setAnalysis(data);
        toast({
          title: "Analysis complete",
          description: "ATS scoring and suggestions are ready.",
        });
      },
      onError: () => {
        toast({
          title: "Analysis failed",
          description: "There was an error analyzing your resume. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleAnalyze = () => {
    if (resume) {
      analyzeResume.mutate({ data: { resume } });
    }
  };

  if (!resume) return null;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="flex-none h-16 border-b bg-card flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-xl text-primary font-medium tracking-wide">Resume Drafter</h1>
        </div>
        <div className="flex items-center gap-3">
          <PdfExporter 
            targetRef={resumeRef} 
            fileName={`${resume.contact.name?.replace(/\s+/g, '_') || 'resume'}.pdf`} 
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Preview Workspace */}
        <div className="flex-1 overflow-auto p-6 md:p-8 flex justify-center bg-[#E5E7EB]">
          {/* Zoom wrapper to make A4 document fit nicely */}
          <div className="w-full max-w-[800px] flex-none">
            <div className="shadow-xl bg-white" ref={resumeRef}>
              <TemplateRenderer templateId={selectedTemplate} data={resume} />
            </div>
          </div>
        </div>

        {/* Right Panel: Tools */}
        <div className="w-[400px] flex-none border-l bg-card flex flex-col shadow-lg z-20">
          <Tabs defaultValue="templates" className="flex-1 flex flex-col">
            <div className="px-6 pt-6 pb-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Templates Tab */}
            <TabsContent value="templates" className="flex-1 m-0 overflow-hidden flex flex-col data-[state=active]:flex">
              <ScrollArea className="flex-1 px-6 pb-6">
                <div className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-foreground">Choose a format</h3>
                    <p className="text-xs text-muted-foreground mb-4">Select a layout that best presents your experience.</p>
                  </div>

                  {isLoadingTemplates ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {templates?.map((template) => (
                        <div 
                          key={template.id}
                          className={`
                            relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200
                            ${selectedTemplate === template.id 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-border hover:border-primary/40 hover:bg-accent/30"
                            }
                          `}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-12 h-16 rounded shadow-sm border mt-1 flex-none"
                              style={{ backgroundColor: template.previewColor || "#f0f0f0" }}
                            />
                            <div>
                              <h4 className="font-semibold text-foreground">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          
                          {selectedTemplate === template.id && (
                            <div className="absolute top-3 right-3 text-primary">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="flex-1 m-0 overflow-hidden flex flex-col data-[state=active]:flex">
              <ScrollArea className="flex-1 px-6 pb-6">
                <div className="pt-4 space-y-6">
                  
                  {!analysis && !analyzeResume.isPending && (
                    <div className="flex flex-col items-center text-center p-8 space-y-4 bg-accent/30 rounded-xl border border-dashed mt-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Analyze your resume</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                          Get ATS compliance scoring and actionable suggestions to improve your document.
                        </p>
                      </div>
                      <Button onClick={handleAnalyze} className="mt-2 w-full rounded-full">
                        Run AI Analysis
                      </Button>
                    </div>
                  )}

                  {analyzeResume.isPending && (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground animate-pulse">Analyzing resume structure...</p>
                    </div>
                  )}

                  {analysis && !analyzeResume.isPending && (
                    <div className="space-y-8 pb-8">
                      {/* Score Section */}
                      <div className="bg-card border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-6 mb-4">
                          <div className="relative h-20 w-20 flex-none flex items-center justify-center rounded-full bg-accent">
                            <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                              <circle 
                                cx="40" cy="40" r="36" 
                                fill="none" stroke="currentColor" 
                                strokeWidth="6" 
                                className="text-border" 
                              />
                              <circle 
                                cx="40" cy="40" r="36" 
                                fill="none" stroke="currentColor" 
                                strokeWidth="6"
                                strokeDasharray="226.2"
                                strokeDashoffset={226.2 - (226.2 * analysis.atsScore) / 100}
                                className={
                                  analysis.atsScore >= 80 ? "text-green-500" :
                                  analysis.atsScore >= 60 ? "text-yellow-500" : "text-red-500"
                                }
                              />
                            </svg>
                            <span className="text-2xl font-bold text-foreground relative z-10">{analysis.atsScore}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">ATS Score</h3>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {analysis.atsSummary}
                            </p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full" onClick={handleAnalyze}>
                          Re-run Analysis
                        </Button>
                      </div>

                      {/* Strengths */}
                      {analysis.strengths && analysis.strengths.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-3 text-foreground flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> 
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {analysis.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-muted-foreground pl-6 relative">
                                <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-green-500"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Issues */}
                      {analysis.atsIssues && analysis.atsIssues.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-3 text-foreground flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" /> 
                            Issues to Fix
                          </h3>
                          <div className="space-y-3">
                            {analysis.atsIssues.map((issue, i) => (
                              <Card key={i} className={`border-l-4 ${
                                issue.severity === 'error' ? 'border-l-red-500' :
                                issue.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                              }`}>
                                <CardContent className="p-3 py-3 flex flex-col gap-1">
                                  <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-[10px] h-5 capitalize">
                                      {issue.section}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-foreground mt-1">{issue.message}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {analysis.sectionSuggestions && analysis.sectionSuggestions.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-3 text-foreground flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-primary" /> 
                            Section Suggestions
                          </h3>
                          <div className="space-y-4">
                            {analysis.sectionSuggestions.map((section, i) => (
                              <div key={i} className="bg-accent/30 rounded-lg p-4">
                                <h4 className="font-semibold text-sm capitalize mb-2">{section.section}</h4>
                                <ul className="space-y-2">
                                  {section.suggestions.map((suggestion, j) => (
                                    <li key={j} className="text-sm text-muted-foreground pl-4 relative">
                                      <span className="absolute left-0 top-[0.4rem] h-1.5 w-1.5 rounded bg-primary/50"></span>
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
