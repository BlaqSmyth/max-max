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
  const [fileType, setFileType] = useState<'csv' | 'zip' | null>(null);
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
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
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

  const zipUploadMutation = useMutation({
    mutationFn: async (zipFile: File) => {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("zip", zipFile);

      const response = await fetch("/api/admin/products/bulk-zip", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Create detailed error message if available
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorList = errorData.details.join('\n');
          const totalMsg = errorData.totalErrors > errorData.details.length 
            ? `\n...and ${errorData.totalErrors - errorData.details.length} more errors` 
            : '';
          throw new Error(`${errorData.error}:\n${errorList}${totalMsg}`);
        }
        throw new Error(errorData.error || "Failed to upload ZIP");
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Products uploaded",
        description: `Successfully added ${data.count} products (${data.imagesUploaded} images uploaded)`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
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

    const isCSV = selectedFile.name.endsWith(".csv");
    const isZIP = selectedFile.name.endsWith(".zip");

    if (!isCSV && !isZIP) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or ZIP file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setFileType(isCSV ? 'csv' : 'zip');
    setIsUploading(true);

    try {
      if (isCSV) {
        const text = await selectedFile.text();
        const products = parseCSV(text);
        setParsedProducts(products);
        toast({
          title: "CSV parsed",
          description: `Found ${products.length} valid products`,
        });
      } else {
        // For ZIP, we can't parse it client-side easily, just show file info
        setParsedProducts([]);
        toast({
          title: "ZIP file selected",
          description: `${selectedFile.name} ready to upload`,
        });
      }
    } catch (error) {
      toast({
        title: "Parse error",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
      setFile(null);
      setFileType(null);
      setParsedProducts([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    if (fileType === 'zip') {
      zipUploadMutation.mutate(file);
    } else if (fileType === 'csv') {
      if (parsedProducts.length === 0) {
        toast({
          title: "No products to upload",
          description: "Please select a valid CSV file first",
          variant: "destructive",
        });
        return;
      }
      bulkUploadMutation.mutate(parsedProducts);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedProducts([]);
    setFileType(null);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const template = `name,description,category,price,memberPrice,image,inStock
Mountain Dew,Refreshing citrus soda,beverages,2.50,2.25,,50
Coca-Cola,Classic cola,beverages,1.99,1.79,coca-cola.png,75
Example Product 3,With full URL,dairy,3.00,,https://example.com/image.png,30`;

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
            Upload multiple products using a CSV file or ZIP file (CSV + images)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <p className="text-sm font-medium">Upload Options</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Option 1:</strong> CSV only - images must be URLs or already uploaded
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Option 2:</strong> ZIP file - includes CSV + all product images
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                data-testid="button-download-template"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV Template
              </Button>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                💡 Recommended: Use ZIP Upload
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Create a ZIP file containing your CSV and all product images. The system will automatically match images to products by name.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                <strong>Easy mode:</strong> Just include images (e.g., "mountain-dew.png") - no need for image column in CSV!
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Advanced:</strong> Or specify image filenames in CSV image column for custom mapping.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-file">Upload File (CSV or ZIP)</Label>
            <Input
              id="upload-file"
              type="file"
              accept=".csv,.zip"
              onChange={handleFileChange}
              data-testid="input-upload-file"
            />
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {fileType === 'csv' 
                      ? `${parsedProducts.length} products ready to upload`
                      : `ZIP file ready (images will be uploaded automatically)`
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setParsedProducts([]);
                  setFileType(null);
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
            disabled={!file || bulkUploadMutation.isPending || zipUploadMutation.isPending}
            data-testid="button-confirm-upload"
          >
            {bulkUploadMutation.isPending || zipUploadMutation.isPending
              ? "Uploading..."
              : fileType === 'zip'
              ? "Upload ZIP File"
              : `Upload ${parsedProducts.length} Products`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
