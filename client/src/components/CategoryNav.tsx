import { LayoutGrid, Package, Milk, Croissant, Apple, Salad, Wine, Candy, Cookie, Snowflake, Sparkles, Home, ChevronDown, Beef, Cake, Droplet, PackageOpen, Coffee, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainCategories = [
  { name: "My orders", icon: Package, id: "orders" },
  { name: "Fresh milk", icon: Milk, id: "milk" },
  { name: "Bread", icon: Croissant, id: "bread" },
  { name: "Fresh fruit", icon: Apple, id: "fruit" },
  { name: "Fresh vegetables", icon: Salad, id: "vegetables" },
  { name: "Soft Drinks", icon: Wine, id: "beverages" },
  { name: "Treats, Candy and Chocolate", icon: Candy, id: "treats" },
  { name: "Crisps", icon: Cookie, id: "crisps" },
  { name: "Frozen Food", icon: Snowflake, id: "frozen" },
  { name: "Health & Beauty", icon: Sparkles, id: "health-beauty" },
  { name: "Household", icon: Home, id: "household" },
];

const aislesDropdownCategories = [
  { name: "All Products", icon: LayoutGrid, id: "all" },
  { name: "Fresh Produce", icon: Apple, id: "produce" },
  { name: "Meat & Fish", icon: Beef, id: "meat" },
  { name: "Bakery", icon: Cake, id: "bakery" },
  { name: "Dairy", icon: Droplet, id: "dairy" },
  { name: "Ready Meals", icon: PackageOpen, id: "ready-meals" },
  { name: "Soft Drinks", icon: Wine, id: "beverages" },
  { name: "Frozen Food", icon: Snowflake, id: "frozen" },
  { name: "Snacks", icon: Cookie, id: "snacks" },
  { name: "Breakfast", icon: Coffee, id: "breakfast" },
  { name: "Household", icon: Home, id: "household" },
  { name: "Health & Beauty", icon: Sparkles, id: "health-beauty" },
  { name: "Other", icon: ShoppingBag, id: "other" },
];

interface CategoryNavProps {
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <div className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  data-testid="button-category-aisles"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="whitespace-nowrap">Aisles</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {aislesDropdownCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => onCategoryClick?.(category.id)}
                      data-testid={`menu-category-${category.id}`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {mainCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  onClick={() => onCategoryClick?.(category.id)}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{category.name}</span>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
