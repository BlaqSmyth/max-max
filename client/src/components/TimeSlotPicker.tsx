import { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
  popular?: boolean;
}

interface TimeSlotPickerProps {
  deliveryType: "delivery" | "collect";
  selectedDate?: Date;
  selectedSlot?: string;
  onSelectSlot?: (date: Date, slotId: string) => void;
}

export default function TimeSlotPicker({
  deliveryType,
  selectedDate: initialDate,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());

  // Mock time slots - todo: remove mock functionality
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00 - 10:00", available: true, popular: true },
    { id: "2", time: "10:00 - 12:00", available: true },
    { id: "3", time: "12:00 - 14:00", available: true, price: 0.99 },
    { id: "4", time: "14:00 - 16:00", available: false },
    { id: "5", time: "16:00 - 18:00", available: true },
    { id: "6", time: "18:00 - 20:00", available: true, popular: true },
  ];

  const getNextDays = (count: number): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const dates = getNextDays(7);

  const formatDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold" data-testid="text-timeslot-title">
          Choose your {deliveryType === "delivery" ? "delivery" : "collection"} time
        </h3>

        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {dates.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "outline"}
                className="flex-shrink-0 flex-col gap-1 h-auto py-3 px-4"
                onClick={() => {
                  console.log(`Selected date: ${date.toDateString()}`);
                  setSelectedDate(date);
                }}
                data-testid={`button-date-${date.getDate()}`}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">{formatDate(date)}</span>
              </Button>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <Card
                key={slot.id}
                className={`relative p-4 hover-elevate cursor-pointer ${
                  isSelected ? "border-primary ring-2 ring-primary/20" : ""
                } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (slot.available) {
                    console.log(`Selected slot: ${slot.time}`);
                    onSelectSlot?.(selectedDate, slot.id);
                  }
                }}
                data-testid={`card-timeslot-${slot.id}`}
              >
                {slot.popular && (
                  <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
                    Popular
                  </Badge>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium" data-testid={`text-slot-time-${slot.id}`}>
                      {slot.time}
                    </div>
                    {slot.available ? (
                      <div className="text-sm text-muted-foreground">
                        {slot.price ? `+£${slot.price.toFixed(2)}` : "Free"}
                      </div>
                    ) : (
                      <div className="text-sm text-destructive">Unavailable</div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
