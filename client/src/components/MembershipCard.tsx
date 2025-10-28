import { Crown, QrCode, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MembershipCardProps {
  memberNumber?: string;
  memberSince?: string;
  points?: number;
}

export default function MembershipCard({
  memberNumber = "1234 5678 9012",
  memberSince = "2020",
  points = 450,
}: MembershipCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            <h3 className="text-xl font-bold">Co-op Member</h3>
          </div>

          <div className="space-y-1">
            <p className="text-sm opacity-90">Member Number</p>
            <p className="font-mono text-lg font-semibold tracking-wider" data-testid="text-member-number">
              {memberNumber}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm opacity-90">Member Since</p>
              <p className="font-semibold" data-testid="text-member-since">{memberSince}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Points</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <p className="font-semibold" data-testid="text-member-points">{points}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <QrCode className="h-16 w-16" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-white/10 p-3 backdrop-blur-sm">
        <p className="text-sm font-medium">Active Benefits</p>
        <Badge variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
          View All
        </Badge>
      </div>
    </Card>
  );
}
