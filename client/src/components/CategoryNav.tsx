import { LayoutGrid, Apple, Wine, Candy, Cookie, Snowflake, Home, ChevronDown, Beef, Cake, Droplet, GlassWater, Croissant, Wheat, Cigarette, Globe, Baby, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainCategories = [
  { name: "Fresh Produce", icon: Apple, id: "produce" },
  { name: "Alcohol", icon: Wine, id: "alcohol" },
  { name: "Bakery", icon: Croissant, id: "bakery" },
  { name: "Dairy & Chilled", icon: Droplet, id: "dairy" },
  { name: "Soft Drinks", icon: GlassWater, id: "beverages" },
  { name: "Ambients & sweets/chocolates", icon: Candy, id: "treats" },
  { name: "Crisps & Snacks", icon: Cookie, id: "crisps" },
  { name: "Biscuits", icon: Cookie, id: "biscuits" },
  { name: "Cereals", icon: Wheat, id: "cereals" },
  { name: "Frozen Foods", icon: Snowflake, id: "frozen" },
  { name: "Household", icon: Home, id: "household" },
  { name: "Meat & Fish", icon: Beef, id: "meat" },
  { name: "World Foods", icon: Globe, id: "world-foods" },
  { name: "Babies & Toiletries", icon: Baby, id: "babies" },
  { name: "Charcoal", icon: Flame, id: "charcoal" },
  { name: "Tobacco", icon: Cigarette, id: "tobacco" },
];

const aislesDropdownCategories = [
  { name: "All Products", icon: LayoutGrid, id: "all" },
  { name: "Fresh Produce", icon: Apple, id: "produce" },
  { name: "Alcohol", icon: Wine, id: "alcohol" },
  { name: "Bakery", icon: Cake, id: "bakery" },
  { name: "Dairy & Chilled Food", icon: Droplet, id: "dairy" },
  { name: "Soft Drinks", icon: GlassWater, id: "beverages" },
  { name: "Ambients & Sweets/Chocolates", icon: Candy, id: "treats" },
  { name: "Crisps & Snacks", icon: Cookie, id: "crisps" },
  { name: "Biscuits", icon: Cookie, id: "biscuits" },
  { name: "Cereals", icon: Wheat, id: "cereals" },
  { name: "Frozen Foods", icon: Snowflake, id: "frozen" },
  { name: "Household", icon: Home, id: "household" },
  { name: "Meat & Fish", icon: Beef, id: "meat" },
  { name: "Asia & African Grocery", icon: Globe, id: "world-foods" },
  { name: "Babies & Toiletries", icon: Baby, id: "babies" },
  { name: "Charcoal", icon: Flame, id: "charcoal" },
  { name: "Cigarettes & Tobacco", icon: Cigarette, id: "tobacco" },
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
              <DropdownMenuContent align="start" className="w-64">
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
