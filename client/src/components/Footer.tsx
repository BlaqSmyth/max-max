import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "Shop": ["Browse All", "Fresh Produce", "Offers", "Member Prices"],
  "Services": ["Home Delivery", "Click & Collect", "Store Finder", "Membership"],
  "Help": ["FAQs", "Track Order", "Returns"],
  "About": ["Our Story", "Careers", "Press", "Sustainability"],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
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

          <div className="lg:col-span-1">
            <h4 className="mb-4 text-sm font-semibold" data-testid="text-footer-section-contact">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:Info@maxandmaxgroup.com"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
                  data-testid="link-email-info"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Info@maxandmaxgroup.com</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Orders@maxandmaxgroup.co.uk"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
                  data-testid="link-email-orders"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Orders@maxandmaxgroup.co.uk</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Customer.service@maxandmaxgroup.co.uk"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
                  data-testid="link-email-customerservice"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Customer.service@maxandmaxgroup.co.uk</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Returns@maxandmaxgroup.co.uk"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
                  data-testid="link-email-returns"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Returns@maxandmaxgroup.co.uk</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:02085144953"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  data-testid="link-phone"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>020 8514 4953</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground" data-testid="text-address">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>411 Ilford Lane, Ilford, Essex IG1 2SN</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer-copyright">
            © 2025 Max & Max Trading as Lifestyle Express. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
