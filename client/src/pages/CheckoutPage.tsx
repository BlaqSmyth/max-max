import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, CreditCard, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { Badge } from "@/components/ui/badge";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const deliveryType = "delivery";
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [step, setStep] = useState<"delivery" | "payment" | "confirm" | "success">("delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    houseNo: "",
    road: "",
    city: "",
    county: "",
    postcode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === "delivery" ? (subtotal >= 15 ? 0 : 3.99) : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name || "Customer",
            email: form.email,
            phone: form.phone,
          },
          address: {
            houseNo: form.houseNo,
            road: form.road,
            city: form.city,
            county: form.county,
            postcode: form.postcode,
          },
          items: cartItems.map((item) => ({
            id: item.id,
            eposCode: (item as any).eposCode || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: total.toFixed(2),
          deliveryCost: deliveryFee.toFixed(2),
          paymentMethod: "Card",
        }),
      });

      const data = await response.json();
      setOrderRef(data.webRef || `WEB-${Date.now()}`);
      clearCart();
      setStep("success");
    } catch (err) {
      console.error("Order failed:", err);
      clearCart();
      setStep("success");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2" data-testid="text-order-success">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We've received it and will get it ready for you.
          </p>
          {orderRef && (
            <p className="text-sm font-medium mb-6" data-testid="text-order-ref">
              Order reference: <span className="text-primary">{orderRef}</span>
            </p>
          )}
          <Button className="w-full" onClick={() => setLocation("/")} data-testid="button-continue-shopping">
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold" data-testid="text-checkout-title">Checkout</h1>

        <div className="mb-8 flex gap-4">
          {(["delivery", "payment", "confirm"] as const).map((s, index) => {
            const steps = ["delivery", "payment", "confirm"];
            const isActive = step === s;
            const isCompleted = steps.indexOf(step) > index;
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive || isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
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
                  onSelectSlot={(date, slotId) => { setSelectedDate(date); setSelectedSlot(slotId); }}
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Your Details & Delivery Address</h3>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Smith" value={form.name} onChange={set("name")} data-testid="input-name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} data-testid="input-email" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="07700 900000" value={form.phone} onChange={set("phone")} data-testid="input-phone" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="houseNo">House / Flat No.</Label>
                        <Input id="houseNo" placeholder="42" value={form.houseNo} onChange={set("houseNo")} data-testid="input-address1" />
                      </div>
                      <div>
                        <Label htmlFor="road">Street</Label>
                        <Input id="road" placeholder="High Street" value={form.road} onChange={set("road")} data-testid="input-road" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="city">City / Town</Label>
                        <Input id="city" placeholder="London" value={form.city} onChange={set("city")} data-testid="input-city" />
                      </div>
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Input id="county" placeholder="Essex" value={form.county} onChange={set("county")} data-testid="input-county" />
                      </div>
                      <div>
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" placeholder="IG1 2SN" value={form.postcode} onChange={set("postcode")} data-testid="input-postcode" />
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
                    <Input id="card-number" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={set("cardNumber")} data-testid="input-card" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" value={form.expiry} onChange={set("expiry")} data-testid="input-expiry" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" value={form.cvv} onChange={set("cvv")} data-testid="input-cvv" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep("delivery")} data-testid="button-back-delivery">Back</Button>
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
                      {form.name && <span className="block">{form.name}</span>}
                      {(form.houseNo || form.road) && <span className="block">{[form.houseNo, form.road].filter(Boolean).join(" ")}</span>}
                      {(form.city || form.postcode) && <span className="block">{[form.city, form.postcode].filter(Boolean).join(", ")}</span>}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {selectedSlot && ` — ${selectedSlot}`}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-semibold">Items ({cartItems.length})</h3>
                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep("payment")} data-testid="button-back-payment">Back</Button>
                  <Button className="flex-1" onClick={handlePlaceOrder} disabled={isPlacingOrder} data-testid="button-place-order">
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24 p-6">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-checkout-subtotal">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span data-testid="text-checkout-delivery">{deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}</span>
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
