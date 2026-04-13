import { Mail, Phone, MapPin } from "lucide-react";

const items = [
  { icon: Mail, text: "Info@maxandmaxgroup.com" },
  { icon: Phone, text: "020 8514 4953" },
  { icon: Mail, text: "Orders@maxandmaxgroup.co.uk" },
  { icon: MapPin, text: "411 Ilford Lane, Ilford, Essex IG1 2SN" },
  { icon: Mail, text: "Customer.service@maxandmaxgroup.co.uk" },
  { icon: Phone, text: "020 8514 4953" },
  { icon: Mail, text: "Returns@maxandmaxgroup.co.uk" },
  { icon: MapPin, text: "411 Ilford Lane, Ilford, Essex IG1 2SN" },
];

export default function InfoTicker() {
  return (
    <div className="bg-primary text-primary-foreground py-1.5 overflow-hidden" data-testid="info-ticker">
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => {
          const Icon = item.icon;
          return (
            <span
              key={i}
              className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium px-8"
            >
              <Icon className="h-3 w-3 shrink-0 opacity-80" />
              {item.text}
              <span className="ml-8 opacity-40">•</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
