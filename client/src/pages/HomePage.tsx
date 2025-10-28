import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import DeliveryOptions from "@/components/DeliveryOptions";
import MembershipBanner from "@/components/MembershipBanner";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import ProductDetailModal from "@/components/ProductDetailModal";
import ProductFilters from "@/components/ProductFilters";
import OffersCarousel from "@/components/OffersCarousel";
import MembershipCard from "@/components/MembershipCard";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { mockProducts, mockOffers } from "@/lib/mockData";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from '@assets/generated_images/Family_grocery_shopping_scene_a6507caa.png';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [isMember, setIsMember] = useState(true); // todo: remove mock functionality
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("delivery");
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // todo: remove mock functionality
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

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

  const handleProductClick = (productId: string) => {
    console.log(`Opening product detail for ${productId}`);
    setSelectedProductId(productId);
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
    setIsCartOpen(false);
    setLocation("/checkout");
  };

  let filteredProducts = selectedCategory === "all" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  // Apply sorting
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getProductQuantity = (productId: string): number => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

  const selectedProduct = selectedProductId 
    ? mockProducts.find(p => p.id === selectedProductId)
    : null;

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
        onCtaClick={() => {
          console.log('Shop now clicked');
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <OffersCarousel
        offers={mockOffers}
        onOfferClick={(offerId) => {
          console.log(`Clicked offer: ${offerId}`);
        }}
      />

      {isMember && (
        <section className="py-8 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4">
            <MembershipCard />
          </div>
        </section>
      )}

      <DeliveryOptions
        selectedOption={selectedDelivery}
        onSelectOption={(option) => {
          console.log(`Selected delivery option: ${option}`);
          setSelectedDelivery(option);
        }}
      />

      <section id="products-section" className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold" data-testid="text-products-title">
                {selectedCategory === "all" ? "All Products" : "Products"}
              </h2>
              <p className="mt-2 text-muted-foreground" data-testid="text-products-subtitle">
                {isMember ? "Member prices shown" : "Sign in to see member prices"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:block flex-1 max-w-md">
                <SearchAutocomplete
                  products={mockProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    image: p.image,
                  }))}
                  onSelectProduct={handleProductClick}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="gap-2"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilters.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {selectedFilters.length}
                  </span>
                )}
              </Button>

              <button
                onClick={() => setIsMember(!isMember)}
                className="text-sm text-primary hover:underline whitespace-nowrap"
                data-testid="button-toggle-member"
              >
                {isMember ? "Hide" : "Show"} member prices
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className={`hidden lg:block ${isFiltersOpen ? "" : "lg:hidden"}`}>
              <ProductFilters
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} onClick={() => handleProductClick(product.id)}>
                    <ProductCard
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isFiltersOpen && (
            <div className="lg:hidden">
              <ProductFilters
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          )}
        </div>
      </section>

      <MembershipBanner />

      <Footer />

      <CartSheet
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleCheckout}
      />

      {selectedProduct && (
        <ProductDetailModal
          id={selectedProduct.id}
          name={selectedProduct.name}
          description={selectedProduct.description}
          price={selectedProduct.price}
          memberPrice={selectedProduct.memberPrice}
          image={selectedProduct.image}
          category={selectedProduct.category}
          inStock={selectedProduct.inStock === 1}
          isMember={isMember}
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={handleAddToCart}
          initialQuantity={getProductQuantity(selectedProduct.id)}
        />
      )}
    </div>
  );
}
