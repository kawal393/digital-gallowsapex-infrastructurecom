import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  companyName: string;
  score: number;
  status: string;
  date: string;
  merkleHash?: string | null;
}

const statusLabels: Record<string, string> = {
  compliant: "COMPLIANT",
  mostly_compliant: "MOSTLY COMPLIANT",
  partially_compliant: "PARTIALLY COMPLIANT",
  non_compliant: "NON-COMPLIANT",
};

const statusColors: Record<string, string> = {
  compliant: "bg-compliant text-background",
  mostly_compliant: "bg-warning text-background",
  partially_compliant: "bg-orange-500 text-background",
  non_compliant: "bg-destructive text-destructive-foreground",
};

const ComplianceCertificate = ({ companyName, score, status, date, merkleHash }: Props) => {
  const handleDownload = () => {
    const certContent = `
═══════════════════════════════════════════════════════
              APEX DIGITAL GALLOWS
         EU AI ACT COMPLIANCE CERTIFICATE
═══════════════════════════════════════════════════════

Company:        ${companyName || "N/A"}
Score:          ${score}%
Status:         ${statusLabels[status] || "N/A"}
Assessment Date: ${new Date(date).toLocaleDateString()}
${merkleHash ? `Merkle Hash:    ${merkleHash}` : ""}

This certificate confirms that the above company has
undergone an EU AI Act compliance assessment via the
APEX Digital Gallows verification platform.

Deadline: August 2, 2026

═══════════════════════════════════════════════════════
         Issued by APEX Infrastructure Pty Ltd
         ABN: [Registration Number]
         Melbourne, Australia
═══════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([certContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `APEX-Certificate-${companyName || "company"}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-glow bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Compliance Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{companyName || "Your Company"}</p>
            <p className="text-xs text-muted-foreground">Assessed: {new Date(date).toLocaleDateString()}</p>
          </div>
          <Badge className={statusColors[status] || statusColors.non_compliant}>
            {statusLabels[status] || "N/A"}
          </Badge>
        </div>
        <Button variant="heroOutline" size="sm" className="w-full" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download Certificate
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplianceCertificate;
