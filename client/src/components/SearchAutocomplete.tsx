import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SearchAutocompleteProps {
  products: SearchResult[];
  onSelectProduct?: (productId: string) => void;
  placeholder?: string;
}

export default function SearchAutocomplete({
  products,
  onSelectProduct,
  placeholder = "Search for products...",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, products]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (productId: string) => {
    console.log(`Selected product: ${productId}`);
    onSelectProduct?.(productId);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10"
          data-testid="input-search-autocomplete"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full z-50 mt-2 w-full overflow-hidden shadow-lg">
          <div className="max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex cursor-pointer items-center gap-3 p-3 hover-elevate"
                onClick={() => handleSelect(result.id)}
                data-testid={`search-result-${result.id}`}
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium" data-testid={`search-name-${result.id}`}>
                    {result.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{result.category}</span>
                    <span>•</span>
                    <span className="font-medium">£{result.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
