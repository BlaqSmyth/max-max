import { Truck, Store, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

const options: DeliveryOption[] = [
  {
    id: "delivery",
    title: "Home Delivery",
    description: "Free on orders over £15",
    time: "60 minutes",
    icon: Truck,
  },
  {
    id: "collect",
    title: "Click & Collect",
    description: "Pick up from local store",
    time: "Under 2 hours",
    icon: Store,
  },
];

interface DeliveryOptionsProps {
  selectedOption?: string;
  onSelectOption?: (optionId: string) => void;
}

export default function DeliveryOptions({ selectedOption, onSelectOption }: DeliveryOptionsProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold" data-testid="text-delivery-title">
            How would you like to receive your order?
          </h2>
          <p className="mt-2 text-muted-foreground" data-testid="text-delivery-subtitle">
            Choose the option that works best for you
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <Card
                key={option.id}
                className={`p-6 hover-elevate cursor-pointer ${
                  isSelected ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => onSelectOption?.(option.id)}
                data-testid={`card-delivery-${option.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" data-testid={`text-delivery-title-${option.id}`}>
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-delivery-desc-${option.id}`}>
                      {option.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
                      <Clock className="h-4 w-4" />
                      <span data-testid={`text-delivery-time-${option.id}`}>{option.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
