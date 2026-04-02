import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type Product } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, AlertCircle } from "lucide-react";

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "alcohol",
  "bakery",
  "beverages",
  "crisps",
  "dairy",
  "frozen",
  "household",
  "meat",
  "produce",
  "treats",
];

export function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "beverages",
    price: "",
    memberPrice: "",
    image: "",
    inStock: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [inlineError, setInlineError] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setInlineError("");
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: String(product.price),
        memberPrice: product.memberPrice ? String(product.memberPrice) : "",
        image: product.image,
        inStock: String(product.inStock),
      });
      setImagePreview(product.image && !product.image.includes("placeholder") ? product.image : "");
    } else {
      setFormData({
        name: "",
        description: "",
        category: "beverages",
        price: "",
        memberPrice: "",
        image: "",
        inStock: "1",
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [product?.id, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem("admin_token");
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const payload: any = {
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        price: data.price.trim(),
        image: data.image,
        inStock: parseInt(data.inStock, 10),
      };

      if (data.memberPrice && data.memberPrice.trim()) {
        payload.memberPrice = data.memberPrice.trim();
      }

      console.log("[ProductDialog] Saving product:", method, url, payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("[ProductDialog] Save response:", response.status, responseText);

      if (!response.ok) {
        throw new Error(`Save failed (${response.status}): ${responseText}`);
      }
      return JSON.parse(responseText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Product updated" : "Product created",
        description: "Product has been successfully saved",
      });
      onOpenChange(false);
    },
    onError: (err: any) => {
      console.error("[ProductDialog] Save error:", err);
      setInlineError(err?.message || "Failed to save product. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setInlineError("");

    const name = formData.name.trim();
    const price = formData.price.trim();

    if (!name) {
      setInlineError("Product name is required.");
      return;
    }

    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price)) {
      setInlineError("Price must be a valid number e.g. 2.99");
      return;
    }

    if (formData.memberPrice && formData.memberPrice.trim()) {
      if (!priceRegex.test(formData.memberPrice.trim())) {
        setInlineError("Member price must be a valid number e.g. 2.49");
        return;
      }
    }

    const stock = parseInt(formData.inStock, 10);
    if (isNaN(stock) || stock < 0) {
      setInlineError("Stock must be a whole number (0 or more).");
      return;
    }

    if (imageFile) {
      setUploading(true);
      try {
        const token = localStorage.getItem("admin_token");
        console.log("[ProductDialog] Uploading image:", imageFile.name, imageFile.type, imageFile.size, "bytes");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": imageFile.type || "image/jpeg",
          },
          body: imageFile,
        });

        const responseText = await response.text();
        console.log("[ProductDialog] Upload response:", response.status, responseText);

        if (!response.ok) {
          throw new Error(`Upload failed (${response.status}): ${responseText}`);
        }

        const parsed = JSON.parse(responseText);
        if (!parsed.url) {
          throw new Error("Upload succeeded but no URL returned");
        }

        const updatedFormData = { ...formData, image: parsed.url };
        setFormData(updatedFormData);
        saveMutation.mutate(updatedFormData);
      } catch (err: any) {
        console.error("[ProductDialog] Upload error:", err);
        setInlineError(err?.message || "Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      if (!formData.image) {
        setInlineError("Please select a product image.");
        return;
      }
      saveMutation.mutate(formData);
    }
  };

  const isBusy = uploading || saveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative w-full h-48 bg-white dark:bg-muted rounded-lg overflow-hidden p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  data-testid="input-product-image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-select-image"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {imageFile ? "Change Image" : "Select Image"}
                </Button>
              </div>
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  Image will be uploaded when you save the product
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Coca Cola 2L Bottle"
              data-testid="input-product-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Product description"
              data-testid="input-product-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger data-testid="select-product-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (£)</Label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="2.99"
                data-testid="input-product-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberPrice">Member Price (£)</Label>
              <Input
                id="memberPrice"
                type="text"
                inputMode="decimal"
                value={formData.memberPrice}
                onChange={(e) =>
                  setFormData({ ...formData, memberPrice: e.target.value })
                }
                placeholder="2.49"
                data-testid="input-product-member-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inStock">Stock</Label>
              <Input
                id="inStock"
                type="text"
                inputMode="numeric"
                value={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.value })
                }
                data-testid="input-product-stock"
              />
            </div>
          </div>

          {inlineError && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{inlineError}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isBusy}
              data-testid="button-save-product"
            >
              {uploading
                ? "Uploading image..."
                : saveMutation.isPending
                ? "Saving..."
                : "Save Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
