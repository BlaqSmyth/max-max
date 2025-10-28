import { X, Home, ShoppingBag, MapPin, User, Crown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isMember?: boolean;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "stores", label: "Store Locator", icon: MapPin },
  { id: "membership", label: "Membership", icon: Crown },
  { id: "account", label: "My Account", icon: User },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

export default function MobileMenu({ isOpen, onClose, isMember = false }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        data-testid="overlay-mobile-menu"
      />
      <div className="fixed left-0 top-0 z-50 h-full w-80 border-r bg-background shadow-lg lg:hidden">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-lg font-bold text-primary">Max & Max</p>
                {isMember && (
                  <p className="text-xs text-muted-foreground">Member Account</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-mobile-menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover-elevate"
                    onClick={() => {
                      console.log(`Navigate to: ${item.id}`);
                      onClose();
                    }}
                    data-testid={`button-menu-${item.id}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}

              <Separator className="my-4" />

              <div className="space-y-1">
                <p className="px-3 text-sm font-semibold text-muted-foreground">Quick Links</p>
                <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
                  Delivery Information
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
                  Returns Policy
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
                  Contact Us
                </Button>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            {!isMember ? (
              <Button className="w-full" data-testid="button-join-member">
                <Crown className="mr-2 h-4 w-4" />
                Join Membership
              </Button>
            ) : (
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-sm font-medium">Member Benefits Active</p>
                <p className="text-xs text-muted-foreground">Enjoying exclusive prices</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
