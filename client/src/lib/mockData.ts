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

import pepsiImage from '@assets/stock_images/pepsi_cola_2_liter_b_079c3aab.jpg';
import cokeImage from '@assets/stock_images/coca_cola_2_liter_bo_88017767.jpg';
import redBullImage from '@assets/stock_images/red_bull_energy_drin_340ba973.jpg';
import lucozadeImage from '@assets/stock_images/lucozade_sport_energ_514652af.jpg';
import volvicImage from '@assets/stock_images/volvic_natural_miner_c29b3412.jpg';
import mountainDewImage from '@assets/stock_images/mountain_dew_soda_bo_08354f65.jpg';
import sevenUpImage from '@assets/stock_images/7up_lemon_lime_soda__2c3a7564.jpg';
import irnBruImage from '@assets/stock_images/irn_bru_orange_soda__0bfc5dd9.jpg';
import rubiconImage from '@assets/stock_images/rubicon_mango_juice__1568aea3.jpg';
import monsterImage from '@assets/stock_images/monster_energy_drink_6623cfd4.jpg';

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

  // Soft Drinks - Individual Bottles & Cans
  {
    id: '17',
    name: 'Pepsi Cola 2L Bottle',
    description: 'Classic Pepsi cola, refreshing and bold taste',
    category: 'beverages',
    price: 2.29,
    memberPrice: 1.99,
    image: pepsiImage,
    inStock: 1,
  },
  {
    id: '18',
    name: 'Coca Cola 2L Bottle',
    description: 'Original Coca-Cola, the iconic cola taste',
    category: 'beverages',
    price: 2.29,
    memberPrice: 1.99,
    image: cokeImage,
    inStock: 1,
  },
  {
    id: '19',
    name: 'Mountain Dew 500ml Bottle',
    description: 'Citrus-flavored energizing soda',
    category: 'beverages',
    price: 1.49,
    memberPrice: 1.29,
    image: mountainDewImage,
    inStock: 1,
  },
  {
    id: '20',
    name: '7up Lemon & Lime 2L Bottle',
    description: 'Crisp lemon and lime flavored soda',
    category: 'beverages',
    price: 2.19,
    memberPrice: 1.89,
    image: sevenUpImage,
    inStock: 1,
  },
  {
    id: '21',
    name: 'IRN BRU 500ml Bottle',
    description: 'Scotland\'s iconic orange flavored drink',
    category: 'beverages',
    price: 1.39,
    memberPrice: 1.19,
    image: irnBruImage,
    inStock: 1,
  },

  // Juices & Fruit Drinks
  {
    id: '22',
    name: 'Rubicon Mango 500ml Bottle',
    description: 'Exotic mango flavored fruit drink',
    category: 'beverages',
    price: 1.29,
    memberPrice: 1.09,
    image: rubiconImage,
    inStock: 1,
  },

  // Sports & Energy Drinks
  {
    id: '23',
    name: 'Lucozade Sport 500ml Bottle',
    description: 'Isotonic sports drink for hydration and energy',
    category: 'beverages',
    price: 1.39,
    memberPrice: 1.19,
    image: lucozadeImage,
    inStock: 1,
  },
  {
    id: '24',
    name: 'Red Bull Energy Drink 250ml Can',
    description: 'Original Red Bull energy drink with caffeine and taurine',
    category: 'beverages',
    price: 1.69,
    memberPrice: 1.49,
    image: redBullImage,
    inStock: 1,
  },
  {
    id: '25',
    name: 'Monster Energy 500ml Can',
    description: 'Monster energy drink for maximum energy boost',
    category: 'beverages',
    price: 1.79,
    memberPrice: 1.59,
    image: monsterImage,
    inStock: 1,
  },

  // Water - Packs allowed per user request
  {
    id: '26',
    name: 'Volvic Natural Water 6x1.5L Pack',
    description: 'Pure natural mineral water from volcanic France',
    category: 'beverages',
    price: 4.49,
    memberPrice: 3.99,
    image: volvicImage,
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
