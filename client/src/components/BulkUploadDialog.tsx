import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type InsertProduct } from "@shared/schema";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<Omit<InsertProduct, "id">[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const bulkUploadMutation = useMutation({
    mutationFn: async (products: Omit<InsertProduct, "id">[]) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products }),
      });
      if (!response.ok) throw new Error("Failed to upload products");
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "Products uploaded",
        description: `Successfully added ${data.count} products`,
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload products. Please try again.",
        variant: "destructive",
      });
    },
  });

  const parseCSV = (text: string): Omit<InsertProduct, "id">[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file is empty or invalid");
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const products: Omit<InsertProduct, "id">[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const product: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (header === "name") product.name = value;
        else if (header === "description") product.description = value || null;
        else if (header === "category") product.category = value;
        else if (header === "price") product.price = value;
        else if (header === "memberPrice") product.memberPrice = value || null;
        else if (header === "image") product.image = value;
        else if (header === "inStock") product.inStock = parseInt(value) || 1;
      });

      if (product.name && product.category && product.price && product.image) {
        products.push(product);
      }
    }

    return products;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    try {
      const text = await selectedFile.text();
      const products = parseCSV(text);
      setParsedProducts(products);
      toast({
        title: "File parsed",
        description: `Found ${products.length} valid products`,
      });
    } catch (error) {
      toast({
        title: "Parse error",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive",
      });
      setFile(null);
      setParsedProducts([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (parsedProducts.length === 0) {
      toast({
        title: "No products to upload",
        description: "Please select a valid CSV file first",
        variant: "destructive",
      });
      return;
    }

    bulkUploadMutation.mutate(parsedProducts);
  };

  const handleClose = () => {
    setFile(null);
    setParsedProducts([]);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const template = `name,description,category,price,memberPrice,image,inStock
Example Product 1,This is a description,beverages,2.50,2.25,/path/to/image1.png,1
Example Product 2,Another description,dairy,3.00,,/path/to/image2.png,1`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" data-testid="dialog-bulk-upload">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Upload multiple products at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-md">
            <div>
              <p className="text-sm font-medium">Need a template?</p>
              <p className="text-sm text-muted-foreground">
                Download the CSV template to see the required format
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              data-testid="button-download-template"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              data-testid="input-csv-file"
            />
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsedProducts.length} products ready to upload
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setParsedProducts([]);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {parsedProducts.length > 0 && (
            <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="space-y-2">
                {parsedProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-muted rounded flex justify-between"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">
                      {product.category} - £{product.price}
                    </span>
                  </div>
                ))}
                {parsedProducts.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    ...and {parsedProducts.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} data-testid="button-cancel-upload">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={parsedProducts.length === 0 || bulkUploadMutation.isPending}
            data-testid="button-confirm-upload"
          >
            {bulkUploadMutation.isPending ? "Uploading..." : `Upload ${parsedProducts.length} Products`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
