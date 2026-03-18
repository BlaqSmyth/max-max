import { createClient } from "@supabase/supabase-js";
import { adminAuthService, verifyAdminPassword } from "../../server/adminAuth";
import { randomUUID } from "crypto";
import { parse as parseCsv } from "csv-parse/sync";
import { uploadFileToSupabase, isSupabaseConfigured } from "../../server/supabaseStorage";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// Seed data — 142 products
const SEED_PRODUCTS = [
  { name: "Organic Whole Milk 2L", description: "Fresh organic milk from British farms, rich and creamy", category: "dairy", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/organic_whole_milk_2l.png", inStock: 1 },
  { name: "Free Range Eggs 12 Pack", description: "Free range eggs from happy hens, perfect for any meal", category: "dairy", price: "3.25", memberPrice: "2.99", image: "/attached_assets/generated_images/free_range_eggs_12_pack.png", inStock: 1 },
  { name: "Sourdough Bread Loaf", description: "Artisan sourdough bread baked fresh daily", category: "bakery", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/sourdough_bread_loaf.png", inStock: 1 },
  { name: "Organic Chicken Breast 500g", description: "Tender, juicy organic chicken breast, hormone-free", category: "meat", price: "6.50", memberPrice: "5.99", image: "/attached_assets/generated_images/organic_chicken_breast_500g.png", inStock: 1 },
  { name: "Organic Baby Spinach 200g", description: "Tender young spinach leaves, pre-washed and ready to eat", category: "produce", price: "1.75", memberPrice: "1.50", image: "/attached_assets/generated_images/organic_baby_spinach_200g.png", inStock: 1 },
  { name: "Ripe Avocados 2 Pack", description: "Ready to eat avocados, perfect for guacamole", category: "produce", price: "2.00", memberPrice: "1.75", image: "/attached_assets/generated_images/ripe_avocados_2_pack.png", inStock: 1 },
  { name: "Smoked Salmon 200g", description: "Premium Scottish smoked salmon, hand-sliced", category: "meat", price: "5.50", memberPrice: "4.99", image: "/attached_assets/generated_images/smoked_salmon_200g.png", inStock: 1 },
  { name: "Greek Yogurt 500g", description: "Thick, creamy Greek yogurt with live cultures", category: "dairy", price: "2.20", memberPrice: "1.99", image: "/attached_assets/generated_images/greek_yogurt_500g.png", inStock: 1 },
  { name: "British Cheddar Cheese 400g", description: "Mature British cheddar with a sharp, rich flavour", category: "dairy", price: "3.75", memberPrice: "3.50", image: "/attached_assets/generated_images/british_cheddar_cheese_400g.png", inStock: 1 },
  { name: "Strawberries 400g", description: "Sweet, juicy British strawberries picked at peak ripeness", category: "produce", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/strawberries_400g.png", inStock: 1 },
  { name: "Broccoli Head", description: "Fresh broccoli florets, packed with vitamins", category: "produce", price: "0.89", memberPrice: null, image: "/attached_assets/generated_images/broccoli_head.png", inStock: 1 },
  { name: "Organic Carrots 1kg", description: "Sweet organic carrots, great for snacking or cooking", category: "produce", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/organic_carrots_1kg.png", inStock: 1 },
  { name: "Beef Mince 500g", description: "Lean British beef mince, great for burgers and pasta", category: "meat", price: "4.50", memberPrice: "4.00", image: "/attached_assets/generated_images/beef_mince_500g.png", inStock: 1 },
  { name: "Pork Sausages 8 Pack", description: "Outdoor-bred pork sausages with herbs", category: "meat", price: "3.25", memberPrice: "2.99", image: "/attached_assets/generated_images/pork_sausages_8_pack.png", inStock: 1 },
  { name: "Butter 250g", description: "Creamy British butter, perfect for baking and spreading", category: "dairy", price: "1.85", memberPrice: "1.65", image: "/attached_assets/generated_images/butter_250g.png", inStock: 1 },
  { name: "Wholemeal Bread 800g", description: "Soft wholemeal bread with a hearty texture", category: "bakery", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/wholemeal_bread_800g.png", inStock: 1 },
  { name: "Croissants 4 Pack", description: "Buttery, flaky croissants baked in store daily", category: "bakery", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/croissants_4_pack.png", inStock: 1 },
  { name: "Blueberries 150g", description: "Plump, juicy blueberries bursting with antioxidants", category: "produce", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/blueberries_150g.png", inStock: 1 },
  { name: "Cucumber", description: "Crisp, refreshing cucumber for salads and snacking", category: "produce", price: "0.59", memberPrice: null, image: "/attached_assets/generated_images/cucumber.png", inStock: 1 },
  { name: "Tomatoes 6 Pack", description: "Vine-ripened tomatoes full of flavour", category: "produce", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/tomatoes_6_pack.png", inStock: 1 },
  { name: "Lean Bacon Rashers 200g", description: "Smoked back bacon, perfect for a morning fry-up", category: "meat", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/lean_bacon_rashers_200g.png", inStock: 1 },
  { name: "Orange Juice 1L", description: "Freshly squeezed orange juice with no added sugar", category: "beverages", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/orange_juice_1l.png", inStock: 1 },
  { name: "Semi-Skimmed Milk 2L", description: "Fresh semi-skimmed milk from British farms", category: "dairy", price: "1.55", memberPrice: "1.40", image: "/attached_assets/generated_images/semi_skimmed_milk_2l.png", inStock: 1 },
  { name: "Mature Stilton 200g", description: "Traditional blue Stilton cheese with rich, bold flavour", category: "dairy", price: "3.50", memberPrice: "3.15", image: "/attached_assets/generated_images/mature_stilton_200g.png", inStock: 1 },
  { name: "Pasta Penne 500g", description: "Dried penne pasta from durum wheat", category: "ready-meals", price: "1.10", memberPrice: null, image: "/attached_assets/generated_images/pasta_penne_500g.png", inStock: 1 },
  { name: "Chicken Tikka Masala", description: "Restaurant-quality chicken tikka masala ready in 5 minutes", category: "ready-meals", price: "4.50", memberPrice: "3.99", image: "/attached_assets/generated_images/chicken_tikka_masala.png", inStock: 1 },
  { name: "Mac and Cheese", description: "Creamy macaroni cheese with mature cheddar sauce", category: "ready-meals", price: "3.75", memberPrice: "3.50", image: "/attached_assets/generated_images/mac_and_cheese.png", inStock: 1 },
  { name: "Craft IPA Beer 4 Pack", description: "Hoppy craft IPA with citrus notes, 5.2% ABV", category: "alcohol", price: "6.00", memberPrice: "5.50", image: "/attached_assets/generated_images/craft_ipa_beer_4_pack.png", inStock: 1 },
  { name: "Prosecco 75cl", description: "Light, sparkling Italian prosecco, perfect for celebrations", category: "alcohol", price: "9.00", memberPrice: "8.00", image: "/attached_assets/generated_images/prosecco_75cl.png", inStock: 1 },
  { name: "Red Wine Merlot 75cl", description: "Smooth, full-bodied Merlot with notes of blackberry", category: "alcohol", price: "8.50", memberPrice: "7.75", image: "/attached_assets/generated_images/red_wine_merlot_75cl.png", inStock: 1 },
  { name: "Sea Bass Fillets 2 Pack", description: "Fresh, skin-on sea bass fillets, sustainably sourced", category: "meat", price: "7.50", memberPrice: "6.99", image: "/attached_assets/generated_images/sea_bass_fillets_2_pack.png", inStock: 1 },
  { name: "Lamb Chops 400g", description: "Tender British lamb chops, perfect for grilling", category: "meat", price: "7.00", memberPrice: "6.50", image: "/attached_assets/generated_images/lamb_chops_400g.png", inStock: 1 },
  { name: "Ready Brek Porridge 750g", description: "Smooth, creamy oat porridge ready in 2 minutes", category: "ready-meals", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/ready_brek_porridge_750g.png", inStock: 1 },
  { name: "Baked Beans 4 Pack", description: "Classic baked beans in tomato sauce", category: "ready-meals", price: "1.80", memberPrice: "1.60", image: "/attached_assets/generated_images/baked_beans_4_pack.png", inStock: 1 },
  { name: "Frozen Peas 900g", description: "Sweet, tender garden peas frozen at peak freshness", category: "frozen", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/frozen_peas_900g.png", inStock: 1 },
  { name: "Frozen Fish Fingers 12 Pack", description: "Crispy golden fish fingers made with cod", category: "frozen", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/frozen_fish_fingers_12_pack.png", inStock: 1 },
  { name: "Ice Cream Vanilla 1L", description: "Rich, creamy vanilla ice cream made with real cream", category: "frozen", price: "3.50", memberPrice: "3.00", image: "/attached_assets/generated_images/ice_cream_vanilla_1l.png", inStock: 1 },
  { name: "Frozen Pizza Margherita", description: "Stone-baked margherita pizza with mozzarella", category: "frozen", price: "3.25", memberPrice: "2.99", image: "/attached_assets/generated_images/frozen_pizza_margherita.png", inStock: 1 },
  { name: "Washing Up Liquid 500ml", description: "Effective grease-cutting washing up liquid", category: "household", price: "1.20", memberPrice: null, image: "/attached_assets/generated_images/washing_up_liquid_500ml.png", inStock: 1 },
  { name: "Toilet Rolls 9 Pack", description: "Soft, strong 3-ply toilet rolls", category: "household", price: "4.50", memberPrice: "4.00", image: "/attached_assets/generated_images/toilet_rolls_9_pack.png", inStock: 1 },
  { name: "Laundry Detergent 1.5L", description: "Concentrated liquid detergent for brilliant whites", category: "household", price: "5.50", memberPrice: "5.00", image: "/attached_assets/generated_images/laundry_detergent_1_5l.png", inStock: 1 },
  { name: "All-Purpose Cleaner 750ml", description: "Multi-surface spray cleaner, antibacterial formula", category: "household", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/all_purpose_cleaner_750ml.png", inStock: 1 },
  { name: "Crisps Ready Salted 6 Pack", description: "Classic ready salted crisps, perfectly seasoned", category: "crisps", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/crisps_ready_salted_6_pack.png", inStock: 1 },
  { name: "Crisps Cheese & Onion 6 Pack", description: "Tangy cheese and onion flavoured crisps", category: "crisps", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/crisps_cheese_onion_6_pack.png", inStock: 1 },
  { name: "Chocolate Digestives 300g", description: "Crunchy digestive biscuits with milk chocolate coating", category: "treats", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/chocolate_digestives_300g.png", inStock: 1 },
  { name: "Milk Chocolate Bar 200g", description: "Smooth, creamy milk chocolate, great for sharing", category: "treats", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/milk_chocolate_bar_200g.png", inStock: 1 },
  { name: "Cola 2L", description: "Classic cola soft drink, refreshing and fizzy", category: "beverages", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/cola_2l.png", inStock: 1 },
  { name: "Sparkling Water 6 Pack", description: "Refreshing sparkling mineral water", category: "beverages", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/sparkling_water_6_pack.png", inStock: 1 },
  { name: "Tea Bags 80 Pack", description: "Classic British blend tea bags for a perfect cup", category: "beverages", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/tea_bags_80_pack.png", inStock: 1 },
  { name: "Ground Coffee 250g", description: "Rich, smooth ground coffee for cafetière or filter", category: "beverages", price: "4.00", memberPrice: "3.60", image: "/attached_assets/generated_images/ground_coffee_250g.png", inStock: 1 },
  { name: "Salmon Fillet 350g", description: "Atlantic salmon fillet, omega-3 rich and sustainably sourced", category: "meat", price: "6.00", memberPrice: "5.50", image: "/attached_assets/generated_images/salmon_fillet_350g.png", inStock: 1 },
  { name: "Chicken Thighs 700g", description: "Bone-in chicken thighs for rich, flavourful meals", category: "meat", price: "4.00", memberPrice: "3.60", image: "/attached_assets/generated_images/chicken_thighs_700g.png", inStock: 1 },
  { name: "Sirloin Steak 250g", description: "Prime British sirloin steak, aged for tenderness", category: "meat", price: "8.50", memberPrice: "7.75", image: "/attached_assets/generated_images/sirloin_steak_250g.png", inStock: 1 },
  { name: "Peppers 3 Pack Mixed", description: "Vibrant red, yellow, and orange peppers", category: "produce", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/peppers_3_pack_mixed.png", inStock: 1 },
  { name: "Mushrooms 400g", description: "Chestnut mushrooms with earthy, nutty flavour", category: "produce", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/mushrooms_400g.png", inStock: 1 },
  { name: "Red Onions 1kg", description: "Sweet red onions perfect for salads and roasting", category: "produce", price: "1.00", memberPrice: "0.90", image: "/attached_assets/generated_images/red_onions_1kg.png", inStock: 1 },
  { name: "Garlic Bulb 3 Pack", description: "Firm, fresh garlic bulbs for cooking", category: "produce", price: "0.89", memberPrice: null, image: "/attached_assets/generated_images/garlic_bulb_3_pack.png", inStock: 1 },
  { name: "Lemons 4 Pack", description: "Unwaxed lemons, zesty and full of flavour", category: "produce", price: "1.00", memberPrice: "0.89", image: "/attached_assets/generated_images/lemons_4_pack.png", inStock: 1 },
  { name: "Bananas 6 Pack", description: "Perfectly ripe bananas, naturally sweet", category: "produce", price: "0.99", memberPrice: null, image: "/attached_assets/generated_images/bananas_6_pack.png", inStock: 1 },
  { name: "Apples Braeburn 6 Pack", description: "Crisp, sweet-sharp Braeburn apples", category: "produce", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/apples_braeburn_6_pack.png", inStock: 1 },
  { name: "White Wine Sauvignon Blanc 75cl", description: "Crisp, dry New Zealand Sauvignon Blanc with citrus notes", category: "alcohol", price: "9.50", memberPrice: "8.75", image: "/attached_assets/generated_images/white_wine_sauvignon_blanc_75cl.png", inStock: 1 },
  { name: "Gin 70cl", description: "Premium London Dry Gin with juniper and citrus botanicals", category: "alcohol", price: "22.00", memberPrice: "20.00", image: "/attached_assets/generated_images/gin_70cl.png", inStock: 1 },
  { name: "Lager Beer 12 Pack", description: "Refreshing continental lager, 4.2% ABV", category: "alcohol", price: "11.00", memberPrice: "10.00", image: "/attached_assets/generated_images/lager_beer_12_pack.png", inStock: 1 },
  { name: "Crumpets 6 Pack", description: "Light, fluffy crumpets perfect toasted with butter", category: "bakery", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/crumpets_6_pack.png", inStock: 1 },
  { name: "Seeded Bagels 5 Pack", description: "Chewy seeded bagels great for sandwiches", category: "bakery", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/seeded_bagels_5_pack.png", inStock: 1 },
  { name: "Cinnamon Danish Pastries 4 Pack", description: "Flaky, sweet cinnamon Danish pastries", category: "bakery", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/cinnamon_danish_pastries_4_pack.png", inStock: 1 },
  { name: "Frozen Chips 1kg", description: "Crispy oven chips made from British potatoes", category: "frozen", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/frozen_chips_1kg.png", inStock: 1 },
  { name: "Frozen Edamame 400g", description: "Ready-to-eat edamame beans, lightly salted", category: "frozen", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/frozen_edamame_400g.png", inStock: 1 },
  { name: "Frozen Mixed Berries 500g", description: "Sweet mix of strawberries, raspberries, and blueberries", category: "frozen", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/frozen_mixed_berries_500g.png", inStock: 1 },
  { name: "Fairy Liquid Original 433ml", description: "Original Fairy washing up liquid, tough on grease", category: "household", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/fairy_liquid_original_433ml.png", inStock: 1 },
  { name: "Kitchen Roll 2 Pack", description: "Strong, absorbent kitchen roll for everyday spills", category: "household", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/kitchen_roll_2_pack.png", inStock: 1 },
  { name: "Dishwasher Tablets 30 Pack", description: "All-in-one dishwasher tablets for sparkling clean dishes", category: "household", price: "5.00", memberPrice: "4.50", image: "/attached_assets/generated_images/dishwasher_tablets_30_pack.png", inStock: 1 },
  { name: "Prawn Crackers 75g", description: "Light, crispy prawn crackers great for sharing", category: "crisps", price: "1.00", memberPrice: "0.89", image: "/attached_assets/generated_images/prawn_crackers_75g.png", inStock: 1 },
  { name: "Salt & Vinegar Crisps 6 Pack", description: "Tangy salt and vinegar flavour crisps in family pack", category: "crisps", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/salt_vinegar_crisps_6_pack.png", inStock: 1 },
  { name: "Tortilla Chips 200g", description: "Crunchy tortilla chips perfect for dipping", category: "crisps", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/tortilla_chips_200g.png", inStock: 1 },
  { name: "Cadbury Mini Rolls 5 Pack", description: "Light chocolate sponge rolls with cream filling", category: "treats", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/cadbury_mini_rolls_5_pack.png", inStock: 1 },
  { name: "Haribo Starmix 175g", description: "Assorted gummy sweets, a kids' favourite", category: "treats", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/haribo_starmix_175g.png", inStock: 1 },
  { name: "Kettle Chips Sea Salt 150g", description: "Hand-cooked potato crisps with sea salt", category: "crisps", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/kettle_chips_sea_salt_150g.png", inStock: 1 },
  { name: "Dark Chocolate 85% 100g", description: "Intense dark chocolate with a smooth, bitter finish", category: "treats", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/dark_chocolate_85_100g.png", inStock: 1 },
  { name: "Jaffa Cakes 12 Pack", description: "Classic Jaffa cakes with orange jelly and chocolate", category: "treats", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/jaffa_cakes_12_pack.png", inStock: 1 },
  { name: "Ribena Blackcurrant 1L", description: "Classic blackcurrant juice drink, packed with vitamin C", category: "beverages", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/ribena_blackcurrant_1l.png", inStock: 1 },
  { name: "Lucozade Sport 500ml", description: "Isotonic sports drink to fuel your workout", category: "beverages", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/lucozade_sport_500ml.png", inStock: 1 },
  { name: "Innocent Smoothie Mango 750ml", description: "100% pure mango smoothie with no added sugar", category: "beverages", price: "3.50", memberPrice: "3.15", image: "/attached_assets/generated_images/innocent_smoothie_mango_750ml.png", inStock: 1 },
  { name: "Coconut Milk 400ml", description: "Rich, creamy coconut milk for curries and baking", category: "ready-meals", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/coconut_milk_400ml.png", inStock: 1 },
  { name: "Tinned Tomatoes 400g", description: "Chopped Italian tomatoes in rich tomato juice", category: "ready-meals", price: "0.75", memberPrice: null, image: "/attached_assets/generated_images/tinned_tomatoes_400g.png", inStock: 1 },
  { name: "Chicken Noodle Soup", description: "Hearty chicken noodle soup, ready to heat and eat", category: "ready-meals", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/chicken_noodle_soup.png", inStock: 1 },
  { name: "Sushi Selection Box", description: "Fresh sushi selection with salmon, tuna and prawn", category: "ready-meals", price: "5.50", memberPrice: "5.00", image: "/attached_assets/generated_images/sushi_selection_box.png", inStock: 1 },
  { name: "Halloumi Cheese 225g", description: "Authentic Cypriot halloumi, perfect for grilling", category: "dairy", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/halloumi_cheese_225g.png", inStock: 1 },
  { name: "Oat Milk 1L", description: "Barista oat milk, great for coffee and cereal", category: "dairy", price: "1.65", memberPrice: "1.50", image: "/attached_assets/generated_images/oat_milk_1l.png", inStock: 1 },
  { name: "Clotted Cream 113g", description: "Thick, rich Cornish clotted cream for scones", category: "dairy", price: "2.00", memberPrice: "1.80", image: "/attached_assets/generated_images/clotted_cream_113g.png", inStock: 1 },
  { name: "Double Cream 300ml", description: "Rich double cream for whipping or cooking", category: "dairy", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/double_cream_300ml.png", inStock: 1 },
  { name: "Pork Belly Slices 500g", description: "Slow-cook pork belly slices for rich, crispy results", category: "meat", price: "4.50", memberPrice: "4.00", image: "/attached_assets/generated_images/pork_belly_slices_500g.png", inStock: 1 },
  { name: "Duck Breast 400g", description: "Premium duck breast with rich, gamey flavour", category: "meat", price: "9.00", memberPrice: "8.25", image: "/attached_assets/generated_images/duck_breast_400g.png", inStock: 1 },
  { name: "Venison Steak 300g", description: "Lean, tender venison steak from British deer", category: "meat", price: "10.00", memberPrice: "9.00", image: "/attached_assets/generated_images/venison_steak_300g.png", inStock: 1 },
  { name: "Tiger Prawns 200g", description: "Juicy raw tiger prawns, great for stir-fries", category: "meat", price: "6.50", memberPrice: "5.99", image: "/attached_assets/generated_images/tiger_prawns_200g.png", inStock: 1 },
  { name: "Sweet Potatoes 750g", description: "Naturally sweet orange-fleshed sweet potatoes", category: "produce", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/sweet_potatoes_750g.png", inStock: 1 },
  { name: "Asparagus Bunch", description: "Tender British asparagus spears, in season", category: "produce", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/asparagus_bunch.png", inStock: 1 },
  { name: "Kale 200g", description: "Curly kale, a superfood packed with vitamins K and C", category: "produce", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/kale_200g.png", inStock: 1 },
  { name: "Courgettes 3 Pack", description: "Tender green courgettes great for grilling or pasta", category: "produce", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/courgettes_3_pack.png", inStock: 1 },
  { name: "Mango 2 Pack", description: "Sweet, fragrant Alphonso mangoes at peak ripeness", category: "produce", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/mango_2_pack.png", inStock: 1 },
  { name: "Pineapple", description: "Sweet, juicy whole pineapple ready to enjoy", category: "produce", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/pineapple.png", inStock: 1 },
  { name: "Rosé Wine 75cl", description: "Dry Provence rosé with delicate summer fruit notes", category: "alcohol", price: "9.50", memberPrice: "8.75", image: "/attached_assets/generated_images/rose_wine_75cl.png", inStock: 1 },
  { name: "Whisky 70cl", description: "Smooth 12-year Scotch whisky with honeyed notes", category: "alcohol", price: "28.00", memberPrice: "25.00", image: "/attached_assets/generated_images/whisky_70cl.png", inStock: 1 },
  { name: "Cider 6 Pack", description: "Crisp, refreshing British apple cider, 4.5% ABV", category: "alcohol", price: "8.00", memberPrice: "7.25", image: "/attached_assets/generated_images/cider_6_pack.png", inStock: 1 },
  { name: "Gluten Free Bread 400g", description: "Soft gluten-free white bread slice", category: "bakery", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/gluten_free_bread_400g.png", inStock: 1 },
  { name: "Hot Cross Buns 4 Pack", description: "Spiced hot cross buns with currants and mixed peel", category: "bakery", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/hot_cross_buns_4_pack.png", inStock: 1 },
  { name: "Tiger Bread Roll 4 Pack", description: "Crusty tiger bread rolls with distinctive cracked top", category: "bakery", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/tiger_bread_roll_4_pack.png", inStock: 1 },
  { name: "Cheese & Onion Pasty", description: "Flaky pastry filled with mature cheddar and onion", category: "bakery", price: "2.50", memberPrice: "2.25", image: "/attached_assets/generated_images/cheese_onion_pasty.png", inStock: 1 },
  { name: "Frozen Vegetable Mix 1kg", description: "Mixed frozen vegetables including peas, sweetcorn and carrots", category: "frozen", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/frozen_vegetable_mix_1kg.png", inStock: 1 },
  { name: "Frozen Prawns 400g", description: "Ready-cooked frozen king prawns", category: "frozen", price: "5.50", memberPrice: "5.00", image: "/attached_assets/generated_images/frozen_prawns_400g.png", inStock: 1 },
  { name: "Fabric Softener 1L", description: "Gentle fabric conditioner for softer, fresher laundry", category: "household", price: "3.50", memberPrice: "3.15", image: "/attached_assets/generated_images/fabric_softener_1l.png", inStock: 1 },
  { name: "Bleach 750ml", description: "Thick bleach for deep cleaning and disinfecting", category: "household", price: "1.00", memberPrice: null, image: "/attached_assets/generated_images/bleach_750ml.png", inStock: 1 },
  { name: "Bin Bags 30 Pack", description: "Strong bin bags for kitchen waste", category: "household", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/bin_bags_30_pack.png", inStock: 1 },
  { name: "Sponge Scourers 5 Pack", description: "Dual-sided sponge scourers for tough cleaning jobs", category: "household", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/sponge_scourers_5_pack.png", inStock: 1 },
  { name: "Popchips Original 85g", description: "Popped potato chips with less fat, great crunch", category: "crisps", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/popchips_original_85g.png", inStock: 1 },
  { name: "Rice Cakes 130g", description: "Light, low-calorie rice cakes, lightly salted", category: "crisps", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/rice_cakes_130g.png", inStock: 1 },
  { name: "Maltesers 103g", description: "Crunchy malt honeycomb centres covered in milk chocolate", category: "treats", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/maltesers_103g.png", inStock: 1 },
  { name: "Kit Kat 4 Pack", description: "Classic Kit Kat chocolate wafer fingers", category: "treats", price: "1.25", memberPrice: "1.10", image: "/attached_assets/generated_images/kit_kat_4_pack.png", inStock: 1 },
  { name: "Kinder Bueno 2 Pack", description: "Light wafer bars filled with hazelnut cream", category: "treats", price: "1.50", memberPrice: "1.35", image: "/attached_assets/generated_images/kinder_bueno_2_pack.png", inStock: 1 },
  { name: "Mineral Water Still 6 Pack", description: "Pure natural mineral water, still, 500ml bottles", category: "beverages", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/mineral_water_still_6_pack.png", inStock: 1 },
  { name: "Fever-Tree Tonic Water 4 Pack", description: "Premium Indian tonic water, perfect with gin", category: "beverages", price: "3.50", memberPrice: "3.15", image: "/attached_assets/generated_images/fever_tree_tonic_water_4_pack.png", inStock: 1 },
  { name: "Almond Milk 1L", description: "Unsweetened almond milk, dairy-free alternative", category: "beverages", price: "1.55", memberPrice: "1.40", image: "/attached_assets/generated_images/almond_milk_1l.png", inStock: 1 },
  { name: "Green Tea 40 Bags", description: "Light, refreshing green tea, high in antioxidants", category: "beverages", price: "2.25", memberPrice: "2.00", image: "/attached_assets/generated_images/green_tea_40_bags.png", inStock: 1 },
  { name: "Pad Thai Noodles", description: "Authentic Thai rice noodles with tamarind sauce kit", category: "ready-meals", price: "3.75", memberPrice: "3.50", image: "/attached_assets/generated_images/pad_thai_noodles.png", inStock: 1 },
  { name: "Beef Lasagne", description: "Rich beef lasagne with béchamel sauce, serves 2", category: "ready-meals", price: "4.50", memberPrice: "4.00", image: "/attached_assets/generated_images/beef_lasagne.png", inStock: 1 },
  { name: "Quinoa 400g", description: "Organic tri-colour quinoa, a protein-rich grain", category: "ready-meals", price: "2.75", memberPrice: "2.50", image: "/attached_assets/generated_images/quinoa_400g.png", inStock: 1 },
  { name: "Risotto Rice 500g", description: "Arborio risotto rice for creamy Italian dishes", category: "ready-meals", price: "1.75", memberPrice: "1.55", image: "/attached_assets/generated_images/risotto_rice_500g.png", inStock: 1 },
];

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const sb = getSupabase();
  const { count } = await sb.from("products").select("*", { count: "exact", head: true });
  if (!count || count < 10) {
    const rows = SEED_PRODUCTS.map(p => ({ id: randomUUID(), ...p }));
    await sb.from("products").insert(rows);
  }
  seeded = true;
}

function getPath(event: any): string {
  if (event.rawUrl) {
    try { return new URL(event.rawUrl).pathname; } catch {}
  }
  return event.path || "/";
}

function getBody(event: any): any {
  try {
    if (!event.body) return {};
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body;
    return JSON.parse(raw);
  } catch { return {}; }
}

function json(data: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data),
  };
}

function adminCheck(event: any): boolean {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return false;
  return adminAuthService.validateToken(auth.slice(7));
}

export const handler = async (event: any, _context: any) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization" }, body: "" };
  }

  const path = getPath(event);
  const method = event.httpMethod;
  const sb = getSupabase();

  try {
    if (path === "/api/health") {
      return json({ status: "ok", supabase: !!SUPABASE_URL, hasServiceKey: !!SUPABASE_SERVICE_KEY });
    }

    if (path === "/api/products" && method === "GET") {
      await ensureSeeded();
      const { data, error } = await sb.from("products").select("*");
      if (error) throw error;
      return json(data);
    }

    const productIdMatch = path.match(/^\/api\/products\/([^\/]+)$/);
    if (productIdMatch && method === "GET") {
      const { data, error } = await sb.from("products").select("*").eq("id", productIdMatch[1]).single();
      if (error) return json({ error: "Not found" }, 404);
      return json(data);
    }

    if (path === "/api/admin/login" && method === "POST") {
      const { password } = getBody(event);
      if (!password || !verifyAdminPassword(password)) return json({ error: "Invalid password" }, 401);
      const token = adminAuthService.createSession();
      return json({ token });
    }

    if (path === "/api/admin/logout" && method === "POST") {
      const auth = event.headers?.authorization || event.headers?.Authorization || "";
      if (auth.startsWith("Bearer ")) adminAuthService.revokeToken(auth.slice(7));
      return { statusCode: 204, body: "" };
    }

    if (path === "/api/admin/status" && method === "GET") {
      return json({ authenticated: adminCheck(event) });
    }

    if (path === "/api/products" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const body = getBody(event);
      const id = randomUUID();
      const { data, error } = await sb.from("products").insert({ id, ...body }).select().single();
      if (error) throw error;
      return json(data, 201);
    }

    if (productIdMatch && method === "PUT") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const body = getBody(event);
      const { data, error } = await sb.from("products").update(body).eq("id", productIdMatch[1]).select().single();
      if (error) return json({ error: "Not found" }, 404);
      return json(data);
    }

    if (productIdMatch && method === "DELETE") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const { error } = await sb.from("products").delete().eq("id", productIdMatch[1]);
      if (error) return json({ error: "Not found" }, 404);
      return { statusCode: 204, body: "" };
    }

    if (path === "/api/products/upload-image" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      if (!isSupabaseConfigured()) return json({ error: "Storage not configured" }, 503);
      const contentType = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").split(";")[0];
      const buffer = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body || "", "utf-8");
      const imageUrl = await uploadFileToSupabase(buffer, contentType || "image/jpeg");
      return json({ url: imageUrl });
    }

    if (path === "/api/products/bulk-upload" && method === "POST") {
      if (!adminCheck(event)) return json({ error: "Unauthorized" }, 401);
      const buffer = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body || "", "utf-8");
      const records = parseCsv(buffer.toString("utf-8"), { columns: true, skip_empty_lines: true });
      const inserted: any[] = [];
      for (const row of records as any[]) {
        const { data } = await sb.from("products").insert({ id: randomUUID(), name: row.name, description: row.description || null, category: row.category, price: row.price, memberPrice: row.memberPrice || null, image: row.image || "/attached_assets/placeholder.png", inStock: Number(row.inStock ?? 1) }).select().single();
        if (data) inserted.push(data);
      }
      return json({ created: inserted.length, products: inserted });
    }

    return json({ error: "Not found" }, 404);
  } catch (err: any) {
    console.error("[api] Error:", err?.message, err?.code, err?.details);
    return json({ error: "Internal server error", detail: err?.message }, 500);
  }
};
