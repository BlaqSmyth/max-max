import ProductCard from '../ProductCard';
import milkImage from '@assets/generated_images/Fresh_milk_product_photo_f32b7242.png';

export default function ProductCardExample() {
  return (
    <div className="max-w-xs p-4">
      <ProductCard
        id="milk-1"
        name="Co-op Organic Whole Milk 2L"
        price={2.50}
        memberPrice={2.25}
        image={milkImage}
        isMember={true}
      />
    </div>
  );
}
