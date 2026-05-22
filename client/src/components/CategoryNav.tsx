import {
  LayoutGrid, Apple, Wine, Candy, Cookie, Snowflake, Home, ChevronDown,
  Beef, Cake, Droplet, GlassWater, Croissant, Wheat, Cigarette, Globe,
  Baby, Flame, Package, Heart, Fish, ShoppingCart, Coffee, Leaf, Soup, Wind, Beer, Grape
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_DISPLAY: Record<string, { name: string; icon: LucideIcon }> = {
  "grocery":          { name: "Grocery",              icon: ShoppingCart },
  "wines":            { name: "Wines",                icon: Wine },
  "beers":            { name: "Beers",                icon: Beer },
  "cider":            { name: "Ciders",               icon: GlassWater },
  "alcohol":          { name: "Alcohol Spirits",       icon: Droplet },
  "chocolates":       { name: "Chocolates",           icon: Candy },
  "soft-drinks":      { name: "Soft Drinks",          icon: GlassWater },
  "snacks":           { name: "Snacks",               icon: Cookie },
  "spices":           { name: "Spices",               icon: Leaf },
  "arabic-grocery":   { name: "Arabic & African Grocery", icon: Globe },
  "dairy":            { name: "Dairy",                icon: Droplet },
  "household":        { name: "Household",            icon: Home },
  "frozen-foods":     { name: "Frozen Foods",         icon: Snowflake },
  "dry-foods":        { name: "Dry Foods",            icon: Package },
  "biscuits":         { name: "Biscuits",             icon: Cookie },
  "bakery":           { name: "Bakery",               icon: Croissant },
  "sauces":           { name: "Sauces & Condiments",  icon: Droplet },
  "health-beauty":    { name: "Health & Beauty",      icon: Heart },
  "rice":             { name: "Rice",                 icon: Wheat },
  "tobacco":          { name: "Tobacco",              icon: Cigarette },
  "flour":            { name: "Flour",                icon: Wheat },
  "canned-foods":     { name: "Canned Foods",         icon: Package },
  "sweets-desserts":  { name: "Sweets & Desserts",    icon: Candy },
  "pickle":           { name: "Pickles",              icon: Package },
  "vegetables":       { name: "Vegetables",           icon: Apple },
  "nuts-dried-fruits":{ name: "Nuts & Dried Fruits",  icon: Package },
  "tea":              { name: "Tea & Coffee",         icon: Coffee },
  "lentils":          { name: "Lentils & Pulses",     icon: Package },
  "oil":              { name: "Cooking Oil",          icon: Droplet },
  "noodles":          { name: "Noodles",              icon: Package },
  "toiletries":       { name: "Toiletries",           icon: Baby },
  "ghee":             { name: "Ghee & Butter",        icon: Droplet },
  "meat":             { name: "Meat & Fish",           icon: Beef },
  "frozen-fish":      { name: "Frozen Fish",          icon: Fish },
  "flavoured-water":  { name: "Flavoured Water",      icon: GlassWater },
  "pasta":            { name: "Pasta",                icon: Package },
  "accessories":      { name: "Accessories",          icon: Package },
  "ice-cream":        { name: "Ice Cream",            icon: Snowflake },
  "confectionery":    { name: "Confectionery",        icon: Candy },
  "water":            { name: "Water",                icon: GlassWater },
  "olive":            { name: "Olives",               icon: Package },
  "medicine":         { name: "Medicine & Syrups",    icon: Heart },
  "toys":             { name: "Toys",                 icon: Package },
  "honey":            { name: "Honey",                icon: Package },
  "soup":             { name: "Soup",                 icon: Soup },
  "pharmacy":         { name: "Pharmacy",             icon: Heart },
  "health-products":  { name: "Health Products",      icon: Heart },
  "tin-fish":         { name: "Tinned Fish",          icon: Fish },
  "jam":              { name: "Jams & Spreads",       icon: Package },
  "charcoal":         { name: "Charcoal",             icon: Flame },
  "baby-care":        { name: "Baby Care",            icon: Baby },
  "baby-food":        { name: "Baby Food",            icon: Baby },
  "fruit-veg":        { name: "Fruit & Veg",          icon: Apple },
  "vinegar":          { name: "Vinegar",              icon: Droplet },
  "stationery":       { name: "Stationery",           icon: Package },
  "vape":             { name: "Vape",                  icon: Wind },
  "misc":             { name: "Other",                icon: Package },
};

const HIDDEN_CATEGORIES = new Set(["misc"]);

function getCategoryInfo(id: string): { name: string; icon: LucideIcon } {
  if (CATEGORY_DISPLAY[id]) return CATEGORY_DISPLAY[id];
  const name = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return { name, icon: Package };
}

interface CategoryNavProps {
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
  availableCategories?: string[];
}

export default function CategoryNav({ activeCategory, onCategoryClick, availableCategories = [] }: CategoryNavProps) {
  const visibleCategories = availableCategories.filter(c => !HIDDEN_CATEGORIES.has(c));

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
              <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
                <DropdownMenuItem onClick={() => onCategoryClick?.("all")} data-testid="menu-category-all">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>All Products</span>
                </DropdownMenuItem>
                {visibleCategories.map((id) => {
                  const { name, icon: Icon } = getCategoryInfo(id);
                  return (
                    <DropdownMenuItem
                      key={id}
                      onClick={() => onCategoryClick?.(id)}
                      data-testid={`menu-category-${id}`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {visibleCategories.map((id) => {
              const { name, icon: Icon } = getCategoryInfo(id);
              const isActive = activeCategory === id;
              return (
                <Button
                  key={id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  onClick={() => onCategoryClick?.(id)}
                  data-testid={`button-category-${id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{name}</span>
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
