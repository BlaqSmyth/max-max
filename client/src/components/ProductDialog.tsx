import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import { Upload, Image as ImageIcon } from "lucide-react";

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "beverages",
  "dairy",
  "bakery",
  "produce",
  "meat",
  "ready-meals",
  "alcohol",
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

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        memberPrice: product.memberPrice || "",
        image: product.image,
        inStock: product.inStock.toString(),
      });
      setImagePreview(product.image);
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
  }, [product, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem("admin_token");
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          memberPrice: data.memberPrice ? parseFloat(data.memberPrice) : null,
          inStock: parseInt(data.inStock),
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");
      return response.json();
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
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

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, image: url }));
      setImagePreview(url);
      toast({
        title: "Image uploaded",
        description: "Image has been successfully uploaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
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
                  className="flex-1"
                  data-testid="button-select-image"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
                {imageFile && (
                  <Button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploading}
                    data-testid="button-upload-image"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
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
              required
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
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="2.99"
                required
                data-testid="input-product-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberPrice">Member Price (£)</Label>
              <Input
                id="memberPrice"
                type="number"
                step="0.01"
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
                type="number"
                value={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.value })
                }
                required
                data-testid="input-product-stock"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              data-testid="button-save-product"
            >
              {saveMutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
