import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Store {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone: string;
  distance: string;
  hours: string;
  services: string[];
}

// todo: remove mock functionality
const mockStores: Store[] = [
  {
    id: "1",
    name: "Co-op Food - Central London",
    address: "123 Oxford Street",
    postcode: "W1D 2HG",
    phone: "020 7123 4567",
    distance: "0.5 miles",
    hours: "7am - 11pm",
    services: ["Click & Collect", "Home Delivery", "ATM"],
  },
  {
    id: "2",
    name: "Co-op Food - Camden",
    address: "45 Camden High Street",
    postcode: "NW1 7JG",
    phone: "020 7234 5678",
    distance: "1.2 miles",
    hours: "6am - 11pm",
    services: ["Click & Collect", "Post Office"],
  },
  {
    id: "3",
    name: "Co-op Food - Shoreditch",
    address: "78 Shoreditch High Street",
    postcode: "E1 6JJ",
    phone: "020 7345 6789",
    distance: "1.8 miles",
    hours: "7am - 10pm",
    services: ["Home Delivery", "Pharmacy"],
  },
];

export default function StoreLocatorPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [stores] = useState(mockStores);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b bg-background py-4">
        <div className="mx-auto max-w-7xl px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold" data-testid="text-store-locator-title">
            Find Your Local Co-op Store
          </h1>
          <p className="text-muted-foreground">
            Discover stores near you offering Click & Collect and home delivery services
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Enter your postcode or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
              data-testid="input-store-search"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card className="h-96 overflow-hidden bg-muted">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Map would display here
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Interactive map showing store locations
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {stores.length} stores found
              </h2>
              <Button variant="outline" size="sm" data-testid="button-use-location">
                <Navigation className="mr-2 h-4 w-4" />
                Use My Location
              </Button>
            </div>

            <div className="space-y-4">
              {stores.map((store) => (
                <Card key={store.id} className="p-4 hover-elevate" data-testid={`card-store-${store.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold" data-testid={`text-store-name-${store.id}`}>
                          {store.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {store.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {store.postcode}
                        </p>
                      </div>
                      <Badge variant="secondary">{store.distance}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {store.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{store.hours}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" data-testid={`button-select-store-${store.id}`}>
                        Select Store
                      </Button>
                      <Button variant="outline" data-testid={`button-directions-${store.id}`}>
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
