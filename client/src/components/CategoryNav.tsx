import { Apple, Beef, Cake, Wine, PackageOpen, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { name: "Fresh Produce", icon: Apple, id: "produce" },
  { name: "Meat & Fish", icon: Beef, id: "meat" },
  { name: "Bakery", icon: Cake, id: "bakery" },
  { name: "Dairy", icon: Droplet, id: "dairy" },
  { name: "Alcohol", icon: Wine, id: "alcohol" },
  { name: "Ready Meals", icon: PackageOpen, id: "ready-meals" },
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
