import { useState } from "react";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import DeliveryOptions from "@/components/DeliveryOptions";
import MembershipBanner from "@/components/MembershipBanner";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { mockProducts } from "@/lib/mockData";
import heroImage from '@assets/generated_images/Family_grocery_shopping_scene_a6507caa.png';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function HomePage() {
  const [isMember, setIsMember] = useState(true); // todo: remove mock functionality
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("delivery");
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // todo: remove mock functionality
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log(`Adding product ${productId} with quantity ${quantity} to cart`);
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === productId);
        const price = isMember && product.memberPrice ? product.memberPrice : product.price;
        
        if (existing) {
          return prev.map(item =>
            item.id === productId ? { ...item, quantity, price } : item
          );
        }
        return [...prev, {
          id: productId,
          name: product.name,
          price,
          quantity,
          image: product.image,
        }];
      });
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    console.log(`Updating cart item ${productId} to quantity ${quantity}`);
    handleAddToCart(productId, quantity);
  };

  const filteredProducts = selectedCategory === "all" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getProductQuantity = (productId: string): number => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        isMember={isMember}
      />
      
      <CategoryNav
        activeCategory={selectedCategory}
        onCategoryClick={(category) => {
          console.log(`Selected category: ${category}`);
          setSelectedCategory(category);
        }}
      />

      <HeroSection
        title="Fresh food delivered to your door"
        subtitle="Home delivery in 60 minutes or Click & Collect in under 2 hours"
        image={heroImage}
        onCtaClick={() => console.log('Shop now clicked')}
      />

      <DeliveryOptions
        selectedOption={selectedDelivery}
        onSelectOption={(option) => {
          console.log(`Selected delivery option: ${option}`);
          setSelectedDelivery(option);
        }}
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold" data-testid="text-products-title">
                {selectedCategory === "all" ? "All Products" : "Products"}
              </h2>
              <p className="mt-2 text-muted-foreground" data-testid="text-products-subtitle">
                {isMember ? "Member prices shown" : "Sign in to see member prices"}
              </p>
            </div>
            <button
              onClick={() => setIsMember(!isMember)}
              className="text-sm text-primary hover:underline"
              data-testid="button-toggle-member"
            >
              {isMember ? "Hide" : "Show"} member prices
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                memberPrice={product.memberPrice}
                image={product.image}
                inStock={product.inStock === 1}
                isMember={isMember}
                onAddToCart={handleAddToCart}
                initialQuantity={getProductQuantity(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <MembershipBanner />

      <Footer />

      <CartSheet
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={() => {
          console.log('Proceeding to checkout with items:', cartItems);
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}
