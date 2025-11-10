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
import deliveryImage from '@assets/generated_images/Home_delivery_service_image_af86caa0.png';

// Using REAL individual product images downloaded from the web
import pepsiBottle from '@assets/pepsi_2l.png';
import cokeBottle from '@assets/coca_cola_2l.png';
import spriteBottle from '@assets/sprite_2l.png';
import tangoBottle from '@assets/tango_orange_500ml.png';
import vimtoBottle from '@assets/vimto_500ml.png';
import monsterCan from '@assets/monster_energy_500ml.png';
import redBullCan from '@assets/red_bull_250ml.png';

export const mockProducts = [
  {
    id: '1',
    name: 'Organic Whole Milk 2L',
    description: 'Fresh organic milk from British farms, rich and creamy',
    category: 'dairy',
    price: 2.50,
    memberPrice: 2.25,
    image: milkImage,
    inStock: 1,
  },
  {
    id: '2',
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked sourdough with a crispy crust and soft interior',
    category: 'bakery',
    price: 2.80,
    memberPrice: 2.50,
    image: breadImage,
    inStock: 1,
  },
  {
    id: '3',
    name: 'British Red Apples (6 pack)',
    description: 'Crisp and sweet British-grown apples, perfect for snacking',
    category: 'produce',
    price: 2.00,
    memberPrice: 1.80,
    image: applesImage,
    inStock: 1,
  },
  {
    id: '4',
    name: 'Ready Meal Pasta Carbonara',
    description: 'Restaurant-quality pasta ready in minutes, made with British bacon',
    category: 'ready-meals',
    price: 4.50,
    memberPrice: 4.00,
    image: readyMealImage,
    inStock: 1,
  },
  {
    id: '5',
    name: 'Free Range Eggs (12 pack)',
    description: 'Large free-range eggs from British farms, perfect for any meal',
    category: 'dairy',
    price: 3.20,
    memberPrice: 2.90,
    image: eggsImage,
    inStock: 1,
  },
  {
    id: '6',
    name: 'Fresh Broccoli',
    description: 'Tender green broccoli florets, packed with nutrients',
    category: 'produce',
    price: 1.50,
    memberPrice: 1.30,
    image: broccoliImage,
    inStock: 1,
  },
  {
    id: '7',
    name: 'Mixed Seasonal Vegetables',
    description: 'Fresh selection of seasonal produce including carrots, peppers, and tomatoes',
    category: 'produce',
    price: 3.50,
    memberPrice: 3.20,
    image: produceImage,
    inStock: 1,
  },
  {
    id: '8',
    name: 'British Beef Steak 400g',
    description: '100% British beef, expertly aged for 21 days for maximum flavor',
    category: 'meat',
    price: 8.50,
    memberPrice: 7.90,
    image: steakImage,
    inStock: 1,
  },
  {
    id: '9',
    name: 'Bakery Selection Box',
    description: 'Assorted fresh baked goods including croissants and pastries',
    category: 'bakery',
    price: 5.00,
    memberPrice: 4.50,
    image: bakeryImage,
    inStock: 1,
  },
  {
    id: '10',
    name: 'Dairy Essentials Bundle',
    description: 'Complete dairy collection: milk, butter, cheese, and yogurt',
    category: 'dairy',
    price: 9.00,
    memberPrice: 8.00,
    image: dairyImage,
    inStock: 1,
  },
  {
    id: '11',
    name: 'Red Wine Selection',
    description: 'Premium red wine varieties from around the world',
    category: 'alcohol',
    price: 12.00,
    memberPrice: 10.50,
    image: wineImage,
    inStock: 1,
  },
  {
    id: '12',
    name: 'White Wine Selection',
    description: 'Crisp and refreshing white wines, perfect for any occasion',
    category: 'alcohol',
    price: 11.00,
    memberPrice: 9.50,
    image: wineImage,
    inStock: 1,
  },
  {
    id: '13',
    name: 'Organic Semi-Skimmed Milk 1L',
    description: 'Light and healthy organic milk from British cows',
    category: 'dairy',
    price: 1.40,
    memberPrice: 1.20,
    image: milkImage,
    inStock: 1,
  },
  {
    id: '14',
    name: 'Wholemeal Bread Loaf',
    description: 'Nutritious wholemeal bread, high in fiber',
    category: 'bakery',
    price: 1.20,
    memberPrice: 1.00,
    image: breadImage,
    inStock: 1,
  },
  {
    id: '15',
    name: 'Green Apples (6 pack)',
    description: 'Tart and crispy Granny Smith apples',
    category: 'produce',
    price: 1.90,
    memberPrice: 1.70,
    image: applesImage,
    inStock: 1,
  },
  {
    id: '16',
    name: 'Ready Meal Lasagne',
    description: 'Classic Italian lasagne with rich meat sauce',
    category: 'ready-meals',
    price: 4.80,
    memberPrice: 4.30,
    image: readyMealImage,
    inStock: 1,
  },

  // Soft Drinks - Individual Bottles & Cans (Using REAL product images from web)
  {
    id: '17',
    name: 'Pepsi Cola 2L Bottle',
    description: 'Classic Pepsi cola, refreshing and bold taste',
    category: 'beverages',
    price: 2.29,
    memberPrice: 1.99,
    image: pepsiBottle,
    inStock: 1,
  },
  {
    id: '18',
    name: 'Coca Cola 2L Bottle',
    description: 'Original Coca-Cola, the iconic cola taste',
    category: 'beverages',
    price: 2.29,
    memberPrice: 1.99,
    image: cokeBottle,
    inStock: 1,
  },
  {
    id: '19',
    name: 'Sprite 2L Bottle',
    description: 'Crisp lemon-lime flavored soda, refreshingly clear',
    category: 'beverages',
    price: 2.19,
    memberPrice: 1.99,
    image: spriteBottle,
    inStock: 1,
  },
  {
    id: '20',
    name: 'Tango Orange 500ml Bottle',
    description: 'Fizzy orange soft drink with real fruit juice',
    category: 'beverages',
    price: 1.25,
    memberPrice: 1.00,
    image: tangoBottle,
    inStock: 1,
  },
  {
    id: '21',
    name: 'Vimto 500ml Bottle',
    description: 'Mixed fruit flavored soft drink',
    category: 'beverages',
    price: 1.25,
    memberPrice: 1.10,
    image: vimtoBottle,
    inStock: 1,
  },

  // Energy Drinks
  {
    id: '22',
    name: 'Red Bull Energy Drink 250ml Can',
    description: 'Original Red Bull energy drink with caffeine and taurine',
    category: 'beverages',
    price: 1.69,
    memberPrice: 1.49,
    image: redBullCan,
    inStock: 1,
  },
  {
    id: '23',
    name: 'Monster Energy 500ml Can',
    description: 'Monster energy drink for maximum energy boost',
    category: 'beverages',
    price: 1.79,
    memberPrice: 1.59,
    image: monsterCan,
    inStock: 1,
  },

  // Additional Soft Drinks from United UK Catalog (Pages 1-3)
  // TODO: Replace placeholder images with real manufacturer PNGs
  {
    id: '24',
    name: '4Kings Mojo Blackcurrant De Coco Drink 500ml',
    description: 'Refreshing coconut water drink with blackcurrant flavor',
    category: 'beverages',
    price: 1.99,
    memberPrice: 1.79,
    image: milkImage, // Placeholder - needs real manufacturer PNG
    inStock: 1,
  },
  {
    id: '25',
    name: '7UP Zero 500ml Bottle',
    description: 'Zero sugar lemon-lime soda, crisp and refreshing',
    category: 'beverages',
    price: 1.30,
    memberPrice: 1.15,
    image: spriteBottle, // Using Sprite as similar product placeholder
    inStock: 1,
  },
  {
    id: '26',
    name: '7UP Regular 330ml Can',
    description: 'Classic lemon-lime soda in convenient can size',
    category: 'beverages',
    price: 0.75,
    memberPrice: 0.65,
    image: spriteBottle, // Placeholder - needs real 7UP can PNG
    inStock: 1,
  },
  {
    id: '27',
    name: '7UP Regular 500ml Bottle',
    description: 'Classic lemon-lime refreshment in 500ml bottle',
    category: 'beverages',
    price: 1.30,
    memberPrice: 1.15,
    image: spriteBottle, // Placeholder - needs real 7UP bottle PNG
    inStock: 1,
  },
  {
    id: '28',
    name: '7UP Regular 2L Bottle',
    description: 'Large 2-liter bottle of classic 7UP',
    category: 'beverages',
    price: 1.99,
    memberPrice: 1.79,
    image: spriteBottle, // Placeholder - needs real 7UP 2L PNG
    inStock: 1,
  },
  {
    id: '29',
    name: '7UP Tropical American 600ml',
    description: 'Tropical fruit flavored 7UP variant',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: tangoBottle, // Placeholder - needs real 7UP Tropical PNG
    inStock: 1,
  },
  {
    id: '30',
    name: '7UP Tropical 2L Bottle',
    description: 'Large bottle of tropical 7UP flavor',
    category: 'beverages',
    price: 1.99,
    memberPrice: 1.79,
    image: tangoBottle, // Placeholder - needs real 7UP Tropical PNG
    inStock: 1,
  },
  {
    id: '31',
    name: '7UP Zero 330ml Can',
    description: 'Zero sugar 7UP in convenient can format',
    category: 'beverages',
    price: 0.79,
    memberPrice: 0.69,
    image: spriteBottle, // Placeholder - needs real 7UP Zero can PNG
    inStock: 1,
  },
  {
    id: '32',
    name: '7UP Zero Pink Lemonade 330ml Can',
    description: 'Zero sugar pink lemonade flavored 7UP',
    category: 'beverages',
    price: 0.75,
    memberPrice: 0.65,
    image: vimtoBottle, // Placeholder - needs real 7UP Pink Lemonade PNG
    inStock: 1,
  },
  {
    id: '33',
    name: '7UP Zero Pink Lemonade 500ml',
    description: 'Refreshing pink lemonade with zero sugar',
    category: 'beverages',
    price: 1.30,
    memberPrice: 1.15,
    image: vimtoBottle, // Placeholder - needs real 7UP Pink Lemonade PNG
    inStock: 1,
  },
  {
    id: '34',
    name: '7UP Zero 2L Bottle',
    description: 'Large zero sugar 7UP bottle',
    category: 'beverages',
    price: 1.99,
    memberPrice: 1.79,
    image: spriteBottle, // Placeholder - needs real 7UP Zero 2L PNG
    inStock: 1,
  },
  {
    id: '35',
    name: 'Aloe Can American Grape 500ml',
    description: 'Aloe vera drink with grape flavor',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: monsterCan, // Placeholder - needs real Aloe Can PNG
    inStock: 1,
  },
  {
    id: '36',
    name: 'Aloe Can Blue Lagoon 500ml',
    description: 'Refreshing blue lagoon flavored aloe drink',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: monsterCan, // Placeholder - needs real Aloe Can PNG
    inStock: 1,
  },
  {
    id: '37',
    name: 'Aloe Can Energy 500ml',
    description: 'Aloe vera energy drink for extra boost',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: monsterCan, // Placeholder - needs real Aloe Can PNG
    inStock: 1,
  },
  {
    id: '38',
    name: 'Aloe Can Fruit Candy 500ml',
    description: 'Sweet fruit candy flavored aloe drink',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: monsterCan, // Placeholder - needs real Aloe Can PNG
    inStock: 1,
  },
  {
    id: '39',
    name: 'Amigo Apple and Strawberry 200ml',
    description: 'Kids fruit drink with apple and strawberry',
    category: 'beverages',
    price: 0.79,
    memberPrice: 0.69,
    image: tangoBottle, // Placeholder - needs real Amigo PNG
    inStock: 1,
  },
  {
    id: '40',
    name: 'Amigo Multivitamin 200ml 8-Pack',
    description: 'Multivitamin fruit drinks for kids, 8 pack',
    category: 'beverages',
    price: 5.49,
    memberPrice: 4.99,
    image: milkImage, // Placeholder - needs real Amigo multipack PNG
    inStock: 1,
  },
  {
    id: '41',
    name: 'Appletiser 275ml Bottle',
    description: 'Sparkling apple juice made from 100% pressed apples',
    category: 'beverages',
    price: 1.79,
    memberPrice: 1.59,
    image: milkImage, // Placeholder - needs real Appletiser PNG
    inStock: 1,
  },
  {
    id: '42',
    name: 'Appletiser 250ml Bottle',
    description: 'Sparkling apple juice in convenient 250ml size',
    category: 'beverages',
    price: 1.09,
    memberPrice: 0.99,
    image: milkImage, // Placeholder - needs real Appletiser PNG
    inStock: 1,
  },
  {
    id: '43',
    name: 'AQUA Carpatica Still Natural Mineral Water 330ml 6-Pack',
    description: 'Premium natural mineral water from Romania, pack of 6',
    category: 'beverages',
    price: 9.60,
    memberPrice: 8.99,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  {
    id: '44',
    name: 'AQUA Carpatica Sparkling Natural Mineral Water 500ml',
    description: 'Naturally carbonated mineral water',
    category: 'beverages',
    price: 0.80,
    memberPrice: 0.70,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  {
    id: '45',
    name: 'AQUA Carpatica Sparkling Natural Mineral Water 1L',
    description: 'Large bottle of sparkling mineral water',
    category: 'beverages',
    price: 1.60,
    memberPrice: 1.45,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  {
    id: '46',
    name: 'AQUA Carpatica Sportscap Still Mineral Water 750ml',
    description: 'Still mineral water with sport cap',
    category: 'beverages',
    price: 1.10,
    memberPrice: 0.99,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  {
    id: '47',
    name: 'AQUA Carpatica Still Natural Mineral Water 1L',
    description: 'Premium still mineral water in 1 liter bottle',
    category: 'beverages',
    price: 1.69,
    memberPrice: 1.49,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  {
    id: '48',
    name: 'AQUA Carpatica Still Natural Mineral Water 2L',
    description: 'Large 2-liter bottle of still mineral water',
    category: 'beverages',
    price: 1.18,
    memberPrice: 1.05,
    image: milkImage, // Placeholder - needs real AQUA Carpatica PNG
    inStock: 1,
  },
  
];

export const mockOffers = [
  {
    id: 'offer-1',
    title: 'Fresh Produce Flash Sale',
    description: 'Save big on fresh fruits and vegetables.',
    discount: '25% OFF',
    image: produceImage,
    validUntil: '31 Oct 2025',
  },
  {
    id: 'offer-2',
    title: 'Free Delivery This Week',
    description: 'Get free home delivery on all orders over £15.',
    discount: 'FREE',
    image: deliveryImage,
    validUntil: '3 Nov 2025',
  },
  {
    id: 'offer-3',
    title: 'Bakery Bundle Deal',
    description: 'Buy 2 bakery items and get 1 free.',
    discount: 'Buy 2 Get 1',
    image: bakeryImage,
    validUntil: '7 Nov 2025',
  },
  {
    id: 'offer-4',
    title: 'Premium Beef Steak',
    description: 'Quality British beef at incredible prices.',
    discount: '30% OFF',
    image: steakImage,
    validUntil: '10 Nov 2025',
  },
  {
    id: 'offer-5',
    title: 'Dairy Savings',
    description: 'Member exclusive prices on all dairy products.',
    discount: '20% OFF',
    image: dairyImage,
    validUntil: '14 Nov 2025',
  },
  {
    id: 'offer-6',
    title: 'Wine Selection',
    description: 'Premium wines at member prices.',
    discount: '15% OFF',
    image: wineImage,
    validUntil: '17 Nov 2025',
  },
];
