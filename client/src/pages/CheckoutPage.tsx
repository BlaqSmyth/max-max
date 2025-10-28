import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { Badge } from "@/components/ui/badge";

interface CheckoutPageProps {
  cartItems?: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  deliveryType?: "delivery" | "collect";
}

export default function CheckoutPage({ cartItems = [], deliveryType = "delivery" }: CheckoutPageProps) {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [step, setStep] = useState<"delivery" | "payment" | "confirm">("delivery");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === "delivery" ? (subtotal >= 15 ? 0 : 3.99) : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    console.log("Placing order", { cartItems, deliveryType, selectedDate, selectedSlot });
    alert("Order placed successfully! (Demo)");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold" data-testid="text-checkout-title">
          Checkout
        </h1>

        <div className="mb-8 flex gap-4">
          {["delivery", "payment", "confirm"].map((s, index) => {
            const isActive = step === s;
            const isCompleted = ["delivery", "payment", "confirm"].indexOf(step) > index;
            
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive || isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === "delivery" ? "Delivery" : s === "payment" ? "Payment" : "Confirm"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === "delivery" && (
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Select Time Slot</h2>
                </div>
                
                <TimeSlotPicker
                  deliveryType={deliveryType}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(date, slotId) => {
                    setSelectedDate(date);
                    setSelectedSlot(slotId);
                  }}
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Delivery Address</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input id="address-line1" placeholder="123 Main Street" data-testid="input-address1" />
                    </div>
                    <div>
                      <Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
                      <Input id="address-line2" placeholder="Apartment, suite, etc." data-testid="input-address2" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="London" data-testid="input-city" />
                      </div>
                      <div>
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" placeholder="SW1A 1AA" data-testid="input-postcode" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={() => setStep("payment")}
                  disabled={!selectedSlot}
                  data-testid="button-continue-payment"
                >
                  Continue to Payment
                </Button>
              </Card>
            )}

            {step === "payment" && (
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" data-testid="input-card" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" data-testid="input-expiry" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" data-testid="input-cvv" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholder">Cardholder Name</Label>
                    <Input id="cardholder" placeholder="John Smith" data-testid="input-cardholder" />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep("delivery")} data-testid="button-back-delivery">
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep("confirm")} data-testid="button-continue-confirm">
                    Continue to Review
                  </Button>
                </div>
              </Card>
            )}

            {step === "confirm" && (
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-semibold">Review Your Order</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">Delivery Details</h3>
                    <p className="text-sm text-muted-foreground">
                      {deliveryType === "delivery" ? "Home Delivery" : "Click & Collect"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString("en-GB", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric" 
                      })}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-semibold">Items ({cartItems.length})</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            £{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep("payment")} data-testid="button-back-payment">
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handlePlaceOrder} data-testid="button-place-order">
                    Place Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24 p-6">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-checkout-subtotal">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span data-testid="text-checkout-delivery">
                    {deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span data-testid="text-checkout-total">£{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 15 && deliveryType === "delivery" && (
                <div className="mt-4 rounded-md bg-muted p-3 text-xs">
                  <p>Add £{(15 - subtotal).toFixed(2)} more for free delivery</p>
                </div>
              )}

              <div className="mt-6">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  Member Prices Applied
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
