import { Crown, Gift, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MembershipBanner() {
  return (
    <div className="border-y bg-primary/5 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold" data-testid="text-membership-title">
              Join Max & Max Membership for just £1
            </h3>
            <p className="text-muted-foreground" data-testid="text-membership-subtitle">
              Get exclusive member prices, personalised offers, and amazing savings
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm">
                <div className="font-medium">Member Prices</div>
                <div className="text-muted-foreground">Save on essentials</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm">
                <div className="font-medium">Weekly Offers</div>
                <div className="text-muted-foreground">Personalized deals</div>
              </div>
            </div>

            <Button size="lg" data-testid="button-join-membership">
              <Crown className="mr-2 h-4 w-4" />
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
