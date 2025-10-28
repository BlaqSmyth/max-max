import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play animation
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, offers.length]);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % offers.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold" data-testid="text-offers-title">
              Weekly Offers
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={prev}
              disabled={isAnimating}
              data-testid="button-offer-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={next}
              disabled={isAnimating}
              data-testid="button-offer-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Card
            className="group relative overflow-hidden hover-elevate cursor-pointer transition-all duration-500 ease-in-out shadow-lg"
            onClick={() => onOfferClick?.(currentOffer.id)}
            data-testid={`card-offer-${currentOffer.id}`}
            style={{
              animation: isAnimating ? 'slideIn 0.5s ease-in-out' : 'none',
            }}
          >
            <div className="grid md:grid-cols-[300px_1fr] h-[180px] md:h-[200px]">
              <div className="relative overflow-hidden">
                <img
                  src={currentOffer.image}
                  alt={currentOffer.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  data-testid={`img-offer-${currentOffer.id}`}
                />
                <Badge
                  variant="destructive"
                  className="absolute right-3 top-3 text-sm px-2 py-1 shadow-lg font-semibold"
                >
                  {currentOffer.discount}
                </Badge>
              </div>
              <div className="relative flex flex-col justify-center p-4 md:p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80"></div>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl md:text-2xl font-bold text-white" data-testid={`text-offer-title-${currentOffer.id}`}>
                    {currentOffer.title}
                  </h3>
                  <p className="mb-3 text-white/90 text-sm md:text-base leading-relaxed line-clamp-2" data-testid={`text-offer-desc-${currentOffer.id}`}>
                    {currentOffer.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs md:text-sm text-white/80">
                      Valid until: {currentOffer.validUntil}
                    </p>
                    <Button 
                      size="sm"
                      variant="secondary" 
                      className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg" 
                      data-testid={`button-offer-shop-${currentOffer.id}`}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-3 flex justify-center gap-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
                data-testid={`indicator-offer-${index}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0.7;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
