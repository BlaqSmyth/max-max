import { useState } from 'react';
import CartSheet from '../CartSheet';
import milkImage from '@assets/generated_images/Fresh_milk_product_photo_f32b7242.png';
import breadImage from '@assets/generated_images/Artisan_bread_product_photo_3bce2d4e.png';
import { Button } from '@/components/ui/button';

export default function CartSheetExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  const mockItems = [
    { id: '1', name: 'Co-op Organic Whole Milk 2L', price: 2.25, quantity: 2, image: milkImage },
    { id: '2', name: 'Artisan Sourdough Bread', price: 2.50, quantity: 1, image: breadImage },
  ];

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <CartSheet
        items={mockItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
