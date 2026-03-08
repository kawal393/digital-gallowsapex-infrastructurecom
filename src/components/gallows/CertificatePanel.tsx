import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Printer, CheckCircle, XCircle } from "lucide-react";
import { type ComplianceCertificate, downloadCertificateJSON, printCertificate } from "@/lib/gallows-certificate";

interface CertificatePanelProps {
  certificate: ComplianceCertificate;
}

const CertificatePanel = ({ certificate }: CertificatePanelProps) => {
  const isApproved = certificate.status === 'APPROVED';

  return (
    <Card className={`bg-gallows-surface border ${isApproved ? 'border-gallows-approved/30' : 'border-gallows-blocked/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest flex items-center gap-2">
            <Award className={`h-4 w-4 ${isApproved ? 'text-gallows-approved' : 'text-gallows-blocked'}`} />
            Compliance Certificate
          </CardTitle>
          <Badge className={`font-mono text-xs border-0 ${isApproved ? 'bg-gallows-approved/15 text-gallows-approved' : 'bg-gallows-blocked/15 text-gallows-blocked'}`}>
            {certificate.certificateId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status */}
        <div className={`p-3 rounded border text-center ${isApproved ? 'border-gallows-approved/20 bg-gallows-approved/5' : 'border-gallows-blocked/20 bg-gallows-blocked/5'}`}>
          <span className={`font-mono text-lg font-bold tracking-wider ${isApproved ? 'text-gallows-approved' : 'text-gallows-blocked'}`}>
            {isApproved ? '✓ STRUCTURALLY VERIFIED' : '✗ STRUCTURALLY BLOCKED'}
          </span>
        </div>

        {/* Attestations */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-gallows-muted block">EU AI ACT ATTESTATIONS</span>
          {certificate.attestations.map((att, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-mono">
              {att.compliant ? (
                <CheckCircle className="h-3.5 w-3.5 text-gallows-approved shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-gallows-blocked shrink-0 mt-0.5" />
              )}
              <div>
                <span className={att.compliant ? 'text-gallows-approved' : 'text-gallows-blocked'}>
                  {att.article}
                </span>
                <span className="text-gallows-muted"> — {att.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Signature */}
        <div className="pt-2 border-t border-gallows-border">
          <span className="text-[10px] font-mono text-gallows-muted block mb-1">CERTIFICATE SIGNATURE</span>
          <span className="font-mono text-[10px] text-gallows-text/60 break-all">
            {certificate.certificateHash}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => downloadCertificateJSON(certificate)}
            className="flex-1 bg-gallows-bg border border-gallows-border text-gallows-text font-mono text-xs hover:bg-gallows-border gap-1.5"
            variant="outline"
            size="sm"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </Button>
          <Button
            onClick={() => printCertificate(certificate)}
            className="flex-1 bg-gallows-bg border border-gallows-border text-gallows-text font-mono text-xs hover:bg-gallows-border gap-1.5"
            variant="outline"
            size="sm"
          >
            <Printer className="h-3.5 w-3.5" />
            PRINT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificatePanel;
