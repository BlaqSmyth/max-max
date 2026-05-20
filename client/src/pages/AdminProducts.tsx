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
import { Plus, Pencil, Trash2, Search, ImageOff, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProductDialog } from "@/components/ProductDialog";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { useLocation } from "wouter";

const CATEGORY_LABELS: Record<string, string> = {
  "accessories":      "Accessories",
  "alcohol":          "Alcohol",
  "arabic-grocery":   "Arabic & African Grocery",
  "baby-care":        "Baby Care",
  "baby-food":        "Baby Food",
  "bakery":           "Bakery",
  "biscuits":         "Biscuits",
  "canned-foods":     "Canned Foods",
  "charcoal":         "Charcoal",
  "chocolates":       "Chocolates",
  "confectionery":    "Confectionery",
  "dairy":            "Dairy & Chilled Food",
  "dates":            "Dates",
  "dry-foods":        "Dry Foods",
  "flavoured-water":  "Flavoured Water",
  "flour":            "Flour",
  "frozen-fish":      "Frozen Fish",
  "frozen-foods":     "Frozen Foods",
  "fruit-veg":        "Fruit & Veg",
  "ghee":             "Ghee & Butter",
  "grocery":          "Grocery",
  "health-beauty":    "Health & Beauty",
  "health-products":  "Health Products",
  "honey":            "Honey",
  "household":        "Household",
  "ice-cream":        "Ice Cream",
  "jam":              "Jams & Spreads",
  "lentils":          "Lentils & Pulses",
  "meat":             "Meat & Fish",
  "medicine":         "Medicine & Syrups",
  "misc":             "Other / Misc",
  "noodles":          "Noodles",
  "nuts-dried-fruits":"Nuts & Dried Fruits",
  "oil":              "Cooking Oil",
  "olive":            "Olives",
  "pasta":            "Pasta",
  "pharmacy":         "Pharmacy",
  "pickle":           "Pickles",
  "rice":             "Rice",
  "sauces":           "Sauces & Condiments",
  "snacks":           "Snacks",
  "soft-drinks":      "Soft Drinks",
  "soup":             "Soup",
  "spices":           "Spices",
  "stationery":       "Stationery",
  "sweets-desserts":  "Sweets & Desserts",
  "tea":              "Tea & Coffee",
  "tin-fish":         "Tinned Fish",
  "tobacco":          "Cigarettes & Tobacco",
  "toiletries":       "Toiletries",
  "toys":             "Toys",
  "vegetables":       "Vegetables",
  "vinegar":          "Vinegar",
  "water":            "Water",
};

interface SyncTypeStatus {
  status: "idle" | "pending" | "running" | "ok" | "error";
  last_run: string | null;
  count: number;
  error: string | null;
  requested: boolean;
  schedule: string;
}

interface SyncStatus {
  products: SyncTypeStatus;
  stock: SyncTypeStatus;
}

function formatLastRun(lastRun: string | null): string {
  if (!lastRun) return "Never synced";
  const diff = Date.now() - new Date(lastRun).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function SyncStatusBadge({ status }: { status: SyncTypeStatus["status"] }) {
  if (status === "ok") return <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="h-3 w-3" /> Synced</span>;
  if (status === "running") return <span className="flex items-center gap-1 text-xs text-blue-600"><RefreshCw className="h-3 w-3 animate-spin" /> Syncing...</span>;
  if (status === "pending") return <span className="flex items-center gap-1 text-xs text-amber-600"><Clock className="h-3 w-3" /> Queued</span>;
  if (status === "error") return <span className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" /> Error</span>;
  return <span className="text-xs text-muted-foreground">Not run yet</span>;
}

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const getToken = () => localStorage.getItem("admin_token");

  const { data: syncStatus } = useQuery<SyncStatus>({
    queryKey: ["/api/admin/epos/status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/epos/status", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: (query) => {
      const d = query.state.data;
      const active = d && (["pending","running"].includes(d.products.status) || ["pending","running"].includes(d.stock.status));
      return active ? 4000 : 20000;
    },
    retry: false,
  });

  const queueSync = async (type: "products" | "stock") => {
    try {
      const endpoint = type === "products" ? "/api/admin/epos/sync-products" : "/api/admin/epos/sync-stock";
      const res = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/epos/status"] });
      toast({
        title: type === "products" ? "Product Sync Queued" : "Stock Sync Queued",
        description: "The sync will start within a minute automatically.",
      });
    } catch (err: any) {
      toast({ title: "Failed to queue sync", description: err.message, variant: "destructive" });
    }
  };

  const isSyncingProducts = syncStatus?.products.status === "running" || syncStatus?.products.status === "pending";
  const isSyncingStock    = syncStatus?.stock.status    === "running" || syncStatus?.stock.status    === "pending";

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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-4 w-4" />
            Epos Direct Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Products</span>
                <SyncStatusBadge status={syncStatus?.products.status ?? "idle"} />
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>Last sync: {formatLastRun(syncStatus?.products.last_run ?? null)}</div>
                {syncStatus?.products.count ? <div>{syncStatus.products.count.toLocaleString()} products in database</div> : null}
                {syncStatus?.products.error ? <div className="text-destructive">{syncStatus.products.error}</div> : null}
                <div className="text-muted-foreground/60">Auto-sync: {syncStatus?.products.schedule ?? "every 24 hours"}</div>
              </div>
              <Button size="sm" className="w-full" onClick={() => queueSync("products")} disabled={isSyncingProducts} data-testid="button-epos-sync-products">
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingProducts ? "animate-spin" : ""}`} />
                {isSyncingProducts ? (syncStatus?.products.status === "pending" ? "Queued..." : "Syncing...") : "Sync Products Now"}
              </Button>
            </div>

            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Stock Levels</span>
                <SyncStatusBadge status={syncStatus?.stock.status ?? "idle"} />
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>Last sync: {formatLastRun(syncStatus?.stock.last_run ?? null)}</div>
                {syncStatus?.stock.count ? <div>{syncStatus.stock.count.toLocaleString()} items updated</div> : null}
                {syncStatus?.stock.error ? <div className="text-destructive">{syncStatus.stock.error}</div> : null}
                <div className="text-muted-foreground/60">Auto-sync: {syncStatus?.stock.schedule ?? "every hour"}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => queueSync("stock")} disabled={isSyncingStock} data-testid="button-epos-sync-stock">
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingStock ? "animate-spin" : ""}`} />
                {isSyncingStock ? (syncStatus?.stock.status === "pending" ? "Queued..." : "Syncing...") : "Sync Stock Now"}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Syncs run automatically in the background. Click the buttons above to trigger an immediate sync.
          </p>
        </CardContent>
      </Card>

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
