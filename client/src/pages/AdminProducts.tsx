import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, ImageOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProductDialog } from "@/components/ProductDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { useLocation } from "wouter";

const CATEGORY_LABELS: Record<string, string> = {
  alcohol: "Alcohol",
  bakery: "Bakery",
  beverages: "Beverages",
  crisps: "Crisps",
  dairy: "Dairy",
  frozen: "Frozen",
  household: "Household",
  meat: "Meat",
  produce: "Produce",
  "ready-meals": "Ready Meals",
  treats: "Treats",
};

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        setLocation("/admin/login");
        throw new Error("Authentication failed");
      }
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categories = useMemo(() => {
    const cats = Object.keys(categoryCounts).sort();
    return cats;
  }, [categoryCounts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const missingImageCount = useMemo(() => {
    const inCategory = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory);
    return inCategory.filter(p => p.image.includes("placeholder")).length;
  }, [products, selectedCategory]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-3xl font-bold" data-testid="text-page-title">Products</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsBulkUploadOpen(true)} 
            data-testid="button-bulk-upload"
          >
            <Plus className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={handleAdd} data-testid="button-add-product">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="category-filter-bar">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="toggle-elevate"
          data-testid="button-category-all"
        >
          All
          <Badge variant="secondary" className="ml-1.5 no-default-active-elevate" data-testid="badge-count-all">
            {products.length}
          </Badge>
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="toggle-elevate"
            data-testid={`button-category-${cat}`}
          >
            {CATEGORY_LABELS[cat] || cat}
            <Badge variant="secondary" className="ml-1.5 no-default-active-elevate" data-testid={`badge-count-${cat}`}>
              {categoryCounts[cat]}
            </Badge>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>
              {selectedCategory === "all"
                ? "All Products"
                : CATEGORY_LABELS[selectedCategory] || selectedCategory}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""})
              </span>
            </CardTitle>
            {missingImageCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ImageOff className="w-4 h-4" />
                <span data-testid="text-missing-images">{missingImageCount} missing image{missingImageCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No products found" : "No products in this category"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Member Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const hasPlaceholder = product.image.includes("placeholder");
                  return (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <div className={`w-16 h-16 rounded-md border p-1 ${hasPlaceholder ? "bg-muted" : "bg-white dark:bg-muted"}`}>
                          {hasPlaceholder ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-6 h-6 text-muted-foreground" />
                            </div>
                          ) : (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              data-testid={`img-product-${product.id}`}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium" data-testid={`text-name-${product.id}`}>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="no-default-active-elevate" data-testid={`badge-category-${product.id}`}>
                          {CATEGORY_LABELS[product.category] || product.category}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-price-${product.id}`}>£{product.price}</TableCell>
                      <TableCell>
                        {product.memberPrice ? `£${product.memberPrice}` : "-"}
                      </TableCell>
                      <TableCell>{product.inStock}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProductDialog
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}
