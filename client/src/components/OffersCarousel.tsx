import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  validUntil: string;
}

interface OffersCarouselProps {
  offers: Offer[];
  onOfferClick?: (offerId: string) => void;
}

export default function OffersCarousel({ offers, onOfferClick }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    console.log("Next offer");
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prev = () => {
    console.log("Previous offer");
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold" data-testid="text-offers-title">
              Weekly Offers
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              data-testid="button-offer-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              data-testid="button-offer-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card
          className="relative overflow-hidden hover-elevate cursor-pointer"
          onClick={() => onOfferClick?.(currentOffer.id)}
          data-testid={`card-offer-${currentOffer.id}`}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden md:aspect-auto">
              <img
                src={currentOffer.image}
                alt={currentOffer.title}
                className="h-full w-full object-cover"
                data-testid={`img-offer-${currentOffer.id}`}
              />
              <Badge
                variant="destructive"
                className="absolute right-4 top-4 text-lg px-3 py-1"
              >
                {currentOffer.discount}
              </Badge>
            </div>
            <div className="flex flex-col justify-center p-6">
              <h3 className="mb-2 text-2xl font-bold" data-testid={`text-offer-title-${currentOffer.id}`}>
                {currentOffer.title}
              </h3>
              <p className="mb-4 text-muted-foreground" data-testid={`text-offer-desc-${currentOffer.id}`}>
                {currentOffer.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Valid until: {currentOffer.validUntil}
              </p>
              <Button className="mt-6 w-fit" data-testid={`button-offer-shop-${currentOffer.id}`}>
                Shop Now
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-4 flex justify-center gap-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary" : "bg-muted-foreground/30"
              }`}
              data-testid={`indicator-offer-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
