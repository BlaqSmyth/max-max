import { ShoppingCart, Search, MapPin, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  isMember?: boolean;
}

export default function Header({ 
  cartItemCount = 0, 
  onCartClick,
  onMenuClick,
  isMember = false
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              data-testid="button-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <a href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-primary-foreground">Co-op</span>
              </div>
            </a>
          </div>

          <div className="hidden flex-1 md:flex md:max-w-md lg:max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-2 lg:flex"
              data-testid="button-location"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Set location</span>
            </Button>

            {isMember && (
              <Badge variant="secondary" className="hidden lg:inline-flex" data-testid="badge-member">
                Member
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              data-testid="button-account"
            >
              <User className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 pb-3 md:hidden">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="flex-1"
            data-testid="input-search-mobile"
          />
        </div>
      </div>
    </header>
  );
}
