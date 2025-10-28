import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSheetProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onCheckout?: () => void;
}

export default function CartSheet({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onCheckout,
}: CartSheetProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryThreshold = 15;
  const deliveryFee = subtotal >= deliveryThreshold ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-cart"
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-background shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold" data-testid="text-cart-title">
              Your Basket ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <p className="text-center text-muted-foreground" data-testid="text-empty-cart">
                Your basket is empty
              </p>
              <Button onClick={onClose} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          data-testid={`img-cart-${item.id}`}
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-medium" data-testid={`text-cart-name-${item.id}`}>
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm font-semibold" data-testid={`text-cart-price-${item.id}`}>
                            £{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                            data-testid={`button-cart-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[2rem] text-center text-sm" data-testid={`text-cart-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                            data-testid={`button-cart-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">£{subtotal.toFixed(2)}</span>
                  </div>
                  {subtotal < deliveryThreshold && (
                    <div className="rounded-md bg-muted p-2 text-xs">
                      <p data-testid="text-delivery-threshold">
                        Add £{(deliveryThreshold - subtotal).toFixed(2)} more for free delivery
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span data-testid="text-delivery-fee">
                      {deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span data-testid="text-total">£{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={onCheckout}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
