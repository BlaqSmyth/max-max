// todo: remove mock functionality
import milkImage from '@assets/generated_images/Fresh_milk_product_photo_f32b7242.png';
import breadImage from '@assets/generated_images/Artisan_bread_product_photo_3bce2d4e.png';
import applesImage from '@assets/generated_images/Fresh_apples_product_photo_8e2a290d.png';
import readyMealImage from '@assets/generated_images/Ready_meal_product_photo_ccde0adf.png';
import eggsImage from '@assets/generated_images/Fresh_eggs_product_photo_2a6b8195.png';
import broccoliImage from '@assets/generated_images/Fresh_broccoli_product_photo_dd14a650.png';
import produceImage from '@assets/generated_images/Fresh_produce_assortment_7dc64d24.png';
import steakImage from '@assets/generated_images/British_beef_steak_a4049cd2.png';
import bakeryImage from '@assets/generated_images/Fresh_bakery_products_f24133a0.png';
import dairyImage from '@assets/generated_images/Dairy_products_collection_6d15fc58.png';
import wineImage from '@assets/generated_images/Wine_bottles_collection_1ff2a298.png';

export const mockProducts = [
  {
    id: '1',
    name: 'Co-op Organic Whole Milk 2L',
    description: 'Fresh organic milk from British farms',
    category: 'dairy',
    price: 2.50,
    memberPrice: 2.25,
    image: milkImage,
    inStock: 1,
  },
  {
    id: '2',
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked sourdough with a crispy crust',
    category: 'bakery',
    price: 2.80,
    memberPrice: 2.50,
    image: breadImage,
    inStock: 1,
  },
  {
    id: '3',
    name: 'British Red Apples (6 pack)',
    description: 'Crisp and sweet British-grown apples',
    category: 'produce',
    price: 2.00,
    memberPrice: 1.80,
    image: applesImage,
    inStock: 1,
  },
  {
    id: '4',
    name: 'Ready Meal Pasta Carbonara',
    description: 'Restaurant-quality pasta ready in minutes',
    category: 'ready-meals',
    price: 4.50,
    memberPrice: 4.00,
    image: readyMealImage,
    inStock: 1,
  },
  {
    id: '5',
    name: 'Free Range Eggs (12 pack)',
    description: 'Large free-range eggs from British farms',
    category: 'dairy',
    price: 3.20,
    memberPrice: 2.90,
    image: eggsImage,
    inStock: 1,
  },
  {
    id: '6',
    name: 'Fresh Broccoli',
    description: 'Tender green broccoli florets',
    category: 'produce',
    price: 1.50,
    memberPrice: 1.30,
    image: broccoliImage,
    inStock: 1,
  },
  {
    id: '7',
    name: 'Mixed Seasonal Vegetables',
    description: 'Fresh selection of seasonal produce',
    category: 'produce',
    price: 3.50,
    memberPrice: 3.20,
    image: produceImage,
    inStock: 1,
  },
  {
    id: '8',
    name: 'British Beef Steak 400g',
    description: '100% British beef, expertly aged',
    category: 'meat',
    price: 8.50,
    memberPrice: 7.90,
    image: steakImage,
    inStock: 1,
  },
  {
    id: '9',
    name: 'Bakery Selection Box',
    description: 'Assorted fresh baked goods',
    category: 'bakery',
    price: 5.00,
    memberPrice: 4.50,
    image: bakeryImage,
    inStock: 1,
  },
  {
    id: '10',
    name: 'Dairy Essentials Bundle',
    description: 'Milk, butter, cheese, and yogurt',
    category: 'dairy',
    price: 9.00,
    memberPrice: 8.00,
    image: dairyImage,
    inStock: 1,
  },
  {
    id: '11',
    name: 'Red Wine Selection',
    description: 'Premium red wine varieties',
    category: 'alcohol',
    price: 12.00,
    memberPrice: 10.50,
    image: wineImage,
    inStock: 1,
  },
  {
    id: '12',
    name: 'White Wine Selection',
    description: 'Crisp and refreshing white wines',
    category: 'alcohol',
    price: 11.00,
    memberPrice: 9.50,
    image: wineImage,
    inStock: 1,
  },
];
