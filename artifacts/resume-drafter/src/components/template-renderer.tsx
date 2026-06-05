import { ParsedResume } from "@workspace/api-client-react";
import { ClassicTemplate } from "./templates/classic";
import { ModernTemplate } from "./templates/modern";
import { MinimalTemplate } from "./templates/minimal";
import { ExecutiveTemplate } from "./templates/executive";

interface TemplateRendererProps {
  templateId: string;
  data: ParsedResume;
}

export function TemplateRenderer({ templateId, data }: TemplateRendererProps) {
  switch (templateId) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    case "executive":
      return <ExecutiveTemplate data={data} />;
    case "classic":
    default:
      return <ClassicTemplate data={data} />;
  }
}
