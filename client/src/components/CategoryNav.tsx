import { LayoutGrid, Package, TrendingUp, Lightbulb, Milk, Croissant, Apple, Salad, UtensilsCrossed, Wine, Candy, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { name: "Aisles", icon: LayoutGrid, id: "all" },
  { name: "My orders", icon: Package, id: "orders" },
  { name: "Top deals", icon: TrendingUp, id: "deals" },
  { name: "Inspiration", icon: Lightbulb, id: "inspiration" },
  { name: "Fresh milk", icon: Milk, id: "milk" },
  { name: "Bread", icon: Croissant, id: "bread" },
  { name: "Fresh fruit", icon: Apple, id: "fruit" },
  { name: "Fresh vegetables", icon: Salad, id: "vegetables" },
  { name: "Ready meals", icon: UtensilsCrossed, id: "ready-meals" },
  { name: "Beer and wine", icon: Wine, id: "beer-wine" },
  { name: "Chocolate", icon: Candy, id: "chocolate" },
  { name: "Crisps", icon: Cookie, id: "crisps" },
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
            {categories.map((category) => {
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
