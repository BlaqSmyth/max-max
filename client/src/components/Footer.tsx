import { Facebook, Twitter, Instagram } from "lucide-react";

const footerLinks = {
  "Shop": ["Browse All", "Fresh Produce", "Offers", "Member Prices"],
  "Services": ["Home Delivery", "Click & Collect", "Store Finder", "Membership"],
  "Help": ["Contact Us", "FAQs", "Track Order", "Returns"],
  "About": ["Our Story", "Careers", "Press", "Sustainability"],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-primary">Max & Max</h3>
            <p className="mt-4 text-sm text-muted-foreground" data-testid="text-footer-tagline">
              Fresh quality groceries delivered to your door.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold" data-testid={`text-footer-section-${title.toLowerCase()}`}>
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                      data-testid={`link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer-copyright">
            © 2025 Max & Max. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
