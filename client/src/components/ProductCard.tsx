import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  onAddToCart?: (id: string, quantity: number) => void;
  initialQuantity?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  inStock = true,
  onAddToCart,
  initialQuantity = 0,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const numericPrice = typeof price === 'number' ? price : Number(price);

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

  return (
    <Card className="group relative overflow-hidden hover-elevate" data-testid={`card-product-${id}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 opacity-50"></div>
      <div className="relative p-4">
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-md bg-white dark:bg-muted shadow-sm p-2">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
        </div>

      <div className="space-y-2">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium" data-testid={`text-name-${id}`}>
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold" data-testid={`text-price-${id}`}>
            £{numericPrice.toFixed(2)}
          </span>
        </div>

        {!inStock ? (
          <Button variant="secondary" className="w-full" disabled data-testid={`button-out-of-stock-${id}`}>
            Out of Stock
          </Button>
        ) : quantity === 0 ? (
          <Button
            variant="default"
            className="w-full gap-2"
            onClick={handleAdd}
            data-testid={`button-add-${id}`}
          >
            <Plus className="h-4 w-4" />
            Add to basket
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemove}
              data-testid={`button-decrease-${id}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center font-medium" data-testid={`text-quantity-${id}`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAdd}
              data-testid={`button-increase-${id}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
    </Card>
  );
}
