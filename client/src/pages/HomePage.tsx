import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
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
import MobileMenu from "@/components/MobileMenu";
import { mockOffers } from "@/lib/mockData";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";
import heroImage from '@assets/generated_images/Family_grocery_shopping_scene_a6507caa.png';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { cartItems, addToCart, updateQuantity, getProductQuantity } = useCart();
  const [isMember, setIsMember] = useState(true); // todo: remove mock functionality
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("delivery");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch products from API
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleAddToCart = (productId: string, quantity: number) => {
    console.log(`Adding product ${productId} with quantity ${quantity} to cart`);
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const price = isMember && product.memberPrice 
      ? Number(product.memberPrice) 
      : Number(product.price);
    
    if (quantity === 0) {
      updateQuantity(productId, 0);
    } else {
      addToCart({
        id: productId,
        name: product.name,
        price,
        quantity,
        image: product.image,
      });
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    console.log(`Updating cart item ${productId} to quantity ${quantity}`);
    updateQuantity(productId, quantity);
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

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === "all" 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    // Apply sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const selectedProduct = selectedProductId 
    ? products.find(p => p.id === selectedProductId)
    : null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading products...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-destructive">Failed to load products</div>
          <div className="text-sm text-muted-foreground mt-2">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        isMember={isMember}
        products={products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          image: p.image,
        }))}
        onProductSelect={handleProductClick}
      />
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
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
                      price={Number(product.price)}
                      memberPrice={product.memberPrice ? Number(product.memberPrice) : undefined}
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
          description={selectedProduct.description || ""}
          price={Number(selectedProduct.price)}
          memberPrice={selectedProduct.memberPrice ? Number(selectedProduct.memberPrice) : undefined}
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
