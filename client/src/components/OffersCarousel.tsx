import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(false);

  const pauseAutoPlay = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds of inactivity
    pauseTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      
      // If scroll is happening and it's not from auto-scroll, pause auto-play
      if (!isAutoScrollingRef.current) {
        pauseAutoPlay();
      }
    }
  };

  useEffect(() => {
    // Check scroll position after a small delay to ensure content is rendered
    const timer = setTimeout(() => checkScroll(), 100);
    
    const container = scrollContainerRef.current;
    if (container) {
      // User interaction event listeners to pause auto-play
      const handleUserInteraction = () => {
        if (!isAutoScrollingRef.current) {
          pauseAutoPlay();
        }
      };

      container.addEventListener('scroll', checkScroll);
      container.addEventListener('wheel', handleUserInteraction);
      container.addEventListener('touchstart', handleUserInteraction);
      container.addEventListener('pointerdown', handleUserInteraction);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        container.removeEventListener('wheel', handleUserInteraction);
        container.removeEventListener('touchstart', handleUserInteraction);
        container.removeEventListener('pointerdown', handleUserInteraction);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
      };
    }
    return () => {
      clearTimeout(timer);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        isAutoScrollingRef.current = true;
        
        // If at the end, scroll back to start
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by one card width
          const cardWidth = 320; // approximate card width + gap
          scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
        
        // Reset flag after scroll animation completes
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 500);
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const scroll = (direction: 'left' | 'right') => {
    pauseAutoPlay(); // Pause auto-play when user clicks arrows
    
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      isAutoScrollingRef.current = true;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Reset flag after scroll animation
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    }
  };

  if (offers.length === 0) return null;

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
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              data-testid="button-offer-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              data-testid="button-offer-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="group relative flex-shrink-0 w-[300px] overflow-hidden hover-elevate cursor-pointer transition-all duration-300"
              onClick={() => onOfferClick?.(offer.id)}
              data-testid={`card-offer-${offer.id}`}
            >
              <div className="relative h-[160px] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  data-testid={`img-offer-${offer.id}`}
                />
                <Badge
                  variant="destructive"
                  className="absolute right-3 top-3 text-xs px-2 py-1 shadow-md font-semibold"
                >
                  {offer.discount}
                </Badge>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
                <h3 
                  className="mb-2 text-base font-bold line-clamp-1" 
                  data-testid={`text-offer-title-${offer.id}`}
                >
                  {offer.title}
                </h3>
                <p 
                  className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]" 
                  data-testid={`text-offer-desc-${offer.id}`}
                >
                  {offer.description}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Until {offer.validUntil}
                  </p>
                  <Button 
                    size="sm"
                    variant="default"
                    className="text-xs h-7 px-3"
                    data-testid={`button-offer-shop-${offer.id}`}
                  >
                    Shop
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
