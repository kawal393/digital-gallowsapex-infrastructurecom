import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface Props {
  totalEarnings: number;
  totalReferrals: number;
  conversions: number;
}

const PartnerEarnings = ({ totalEarnings, totalReferrals, conversions }: Props) => {
  const rate = totalReferrals > 0 ? ((conversions / totalReferrals) * 100).toFixed(1) : "0";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-glow bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" /> Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gold-gradient">€{totalEarnings.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="border-glow bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Total Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalReferrals}</p>
        </CardContent>
      </Card>

      <Card className="border-glow bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{rate}%</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerEarnings;
