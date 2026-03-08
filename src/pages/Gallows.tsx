import { useState, useCallback } from "react";
import GallowsHeader from "@/components/gallows/GallowsHeader";
import GatewayInput from "@/components/gallows/GatewayInput";
import VerificationResult from "@/components/gallows/VerificationResult";
import AuditTrailLog from "@/components/gallows/AuditTrailLog";
import PredicateRegistry from "@/components/gallows/PredicateRegistry";
import { runGallows, type GallowsResult } from "@/lib/gallows-engine";

const Gallows = () => {
  const [currentResult, setCurrentResult] = useState<GallowsResult | null>(null);
  const [auditTrail, setAuditTrail] = useState<GallowsResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecute = useCallback(async (action: string, predicateId: string) => {
    setIsProcessing(true);
    try {
      const result = await runGallows(action, predicateId);
      setCurrentResult(result);
      setAuditTrail((prev) => [result, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gallows-bg text-gallows-text">
      <GallowsHeader />
      <main className="p-4 md:p-6 grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_1fr_280px]">
        <GatewayInput onExecute={handleExecute} isProcessing={isProcessing} />
        <VerificationResult result={currentResult} />
        <PredicateRegistry />
        <div className="lg:col-span-3">
          <AuditTrailLog entries={auditTrail} />
        </div>
      </main>
    </div>
  );
};

export default Gallows;
