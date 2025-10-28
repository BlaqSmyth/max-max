import HeroSection from '../HeroSection';
import heroImage from '@assets/generated_images/Family_grocery_shopping_scene_a6507caa.png';

export default function HeroSectionExample() {
  return (
    <HeroSection
      title="Fresh food delivered to your door"
      subtitle="Home delivery in 60 minutes or Click & Collect in under 2 hours"
      image={heroImage}
    />
  );
}
