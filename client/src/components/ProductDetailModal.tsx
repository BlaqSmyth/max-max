import { useState, useEffect } from "react";
import { X, Plus, Minus, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailModalProps {
  id: string;
  name: string;
  description: string;
  price: number;
  memberPrice?: number;
  image: string;
  category: string;
  inStock?: boolean;
  isMember?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (id: string, quantity: number) => void;
  initialQuantity?: number;
}

export default function ProductDetailModal({
  id,
  name,
  description,
  price,
  memberPrice,
  image,
  category,
  inStock = true,
  isMember = false,
  isOpen,
  onClose,
  onAddToCart,
  initialQuantity = 0,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const displayPrice = isMember && memberPrice ? memberPrice : price;
  const hasMemberDiscount = memberPrice && memberPrice < price;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAddToCart?.(id, newQuantity);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAddToCart?.(id, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-product-detail"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background shadow-lg">
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-detail">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    data-testid={`img-detail-${id}`}
                  />
                  {hasMemberDiscount && isMember && (
                    <Badge
                      variant="secondary"
                      className="absolute left-4 top-4"
                      data-testid={`badge-member-detail-${id}`}
                    >
                      Member Price
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Badge variant="outline" className="mb-2" data-testid={`badge-category-${id}`}>
                    {category}
                  </Badge>
                  <h1 className="text-3xl font-bold" data-testid={`text-detail-name-${id}`}>
                    {name}
                  </h1>
                  <p className="mt-2 text-muted-foreground" data-testid={`text-detail-desc-${id}`}>
                    {description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(127 reviews)</span>
                </div>

                <Separator />

                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold" data-testid={`text-detail-price-${id}`}>
                      £{displayPrice.toFixed(2)}
                    </span>
                    {hasMemberDiscount && isMember && (
                      <span className="text-lg text-muted-foreground line-through">
                        £{price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasMemberDiscount && isMember && (
                    <p className="mt-1 text-sm text-primary">
                      You save £{(price - (memberPrice || price)).toFixed(2)} with Member Price
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  {!inStock ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Out of Stock
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRemove}
                          disabled={quantity === 0}
                          data-testid={`button-detail-decrease-${id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[3rem] text-center text-xl font-medium" data-testid={`text-detail-quantity-${id}`}>
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAdd}
                          data-testid={`button-detail-increase-${id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleAdd}
                        data-testid={`button-detail-add-${id}`}
                      >
                        {quantity === 0 ? "Add to Basket" : "Update Basket"}
                      </Button>
                    </div>
                  )}
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
                    <TabsTrigger value="nutrition" data-testid="tab-nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="allergens" data-testid="tab-allergens">Allergens</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-2">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h3 className="mb-2 font-semibold">Product Information</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 100% British sourced ingredients</li>
                        <li>• Freshly prepared daily</li>
                        <li>• Suitable for home freezing</li>
                        <li>• Keep refrigerated below 5°C</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="nutrition" className="space-y-2">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h3 className="mb-2 font-semibold">Nutritional Information</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Energy</span>
                          <span className="font-medium">250 kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat</span>
                          <span className="font-medium">12g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbohydrates</span>
                          <span className="font-medium">28g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span className="font-medium">8g</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="allergens" className="space-y-2">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h3 className="mb-2 font-semibold">Allergen Information</h3>
                      <div className="flex items-start gap-2 text-sm">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          May contain traces of nuts, gluten, and dairy. Please check packaging for full allergen information.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
