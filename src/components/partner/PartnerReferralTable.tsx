import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  commission_amount: number;
  created_at: string;
}

const statusColor: Record<string, string> = {
  clicked: "bg-muted text-muted-foreground",
  signed_up: "bg-blue-500/20 text-blue-400",
  converted: "bg-warning/20 text-warning",
  paid: "bg-compliant/20 text-compliant",
};

const PartnerReferralTable = ({ referrals }: { referrals: Referral[] }) => (
  <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
              No referrals yet. Share your link to get started!
            </TableCell>
          </TableRow>
        ) : (
          referrals.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs">{r.referred_email}</TableCell>
              <TableCell>
                <Badge className={statusColor[r.status] || ""}>{r.status}</Badge>
              </TableCell>
              <TableCell>€{r.commission_amount}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default PartnerReferralTable;
