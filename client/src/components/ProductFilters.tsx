import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function ProductFilters({
  isOpen,
  onClose,
  selectedFilters = [],
  onFilterChange,
  sortBy = "featured",
  onSortChange,
}: ProductFiltersProps) {
  const dietaryOptions: FilterOption[] = [
    { id: "vegetarian", label: "Vegetarian", count: 45 },
    { id: "vegan", label: "Vegan", count: 32 },
    { id: "gluten-free", label: "Gluten Free", count: 28 },
    { id: "dairy-free", label: "Dairy Free", count: 24 },
    { id: "organic", label: "Organic", count: 38 },
  ];

  const priceRanges: FilterOption[] = [
    { id: "under-2", label: "Under £2", count: 56 },
    { id: "2-5", label: "£2 - £5", count: 42 },
    { id: "5-10", label: "£5 - £10", count: 31 },
    { id: "over-10", label: "Over £10", count: 18 },
  ];

  const handleFilterToggle = (filterId: string) => {
    console.log(`Toggling filter: ${filterId}`);
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    console.log("Clearing all filters");
    onFilterChange?.([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        data-testid="overlay-filters"
      />
      <div className="fixed left-0 top-0 z-40 h-full w-80 border-r bg-background shadow-lg lg:static lg:shadow-none">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  data-testid="button-clear-filters"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
                data-testid="button-close-filters"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-6 p-4">
              <div>
                <h3 className="mb-3 font-semibold">Sort By</h3>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">Dietary</h3>
                <div className="space-y-3">
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selectedFilters.includes(option.id)}
                          onCheckedChange={() => handleFilterToggle(option.id)}
                          data-testid={`checkbox-${option.id}`}
                        />
                        <Label
                          htmlFor={option.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({option.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">Price Range</h3>
                <div className="space-y-3">
                  {priceRanges.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selectedFilters.includes(option.id)}
                          onCheckedChange={() => handleFilterToggle(option.id)}
                          data-testid={`checkbox-${option.id}`}
                        />
                        <Label
                          htmlFor={option.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({option.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4 lg:hidden">
            <Button className="w-full" onClick={onClose} data-testid="button-apply-filters">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
