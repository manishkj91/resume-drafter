import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PdfExporterProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export function PdfExporter({ targetRef, fileName = "resume" }: PdfExporterProps) {
  const handleExport = () => {
    if (!targetRef.current) return;

    const printContent = targetRef.current.innerHTML;
    const printStyles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${fileName}</title>
          <style>
            ${printStyles}
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 0; background: white; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Button
      onClick={handleExport}
      className="gap-2 shadow-sm"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
