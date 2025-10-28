import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  image,
  ctaText = "Shop now",
  onCtaClick,
}: HeroSectionProps) {
  return (
    <div className="relative h-96 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      <img
        src={image}
        alt="Hero"
        className="h-full w-full object-cover"
        data-testid="img-hero"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl" data-testid="text-hero-title">
              {title}
            </h1>
            <p className="text-lg text-white/90 md:text-xl" data-testid="text-hero-subtitle">
              {subtitle}
            </p>
            <Button
              size="lg"
              onClick={onCtaClick}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
              data-testid="button-hero-cta"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
