import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Gift, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  referralCode: string;
  referralCount: number;
}

const ReferralCard = ({ referralCode, referralCount }: Props) => {
  const { toast } = useToast();
  const link = `${window.location.origin}?ref=${referralCode}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    toast({ title: "Copied", description: "Referral link copied to clipboard." });
  };

  return (
    <Card className="border-glow bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          Partner Referral
          <Badge className="bg-primary text-primary-foreground ml-auto">50% Commission</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-secondary rounded px-3 py-2 text-foreground/80 truncate font-mono">
            {link}
          </code>
          <Button variant="outline" size="icon" onClick={copy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Users className="h-4 w-4" />{referralCount} referral{referralCount !== 1 ? "s" : ""}</span>
          <Link to="/partner/dashboard" className="text-primary text-xs hover:underline">Partner Dashboard →</Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
