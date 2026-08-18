import type { Banner } from "@/types";

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "Welcome to Olado",
    subtitle: "Shop Rwanda's Largest Online Marketplace",
    image:
      "https://placehold.co/800x400/2E7D32/FFFFFF?text=Welcome+to+Olado",
    link: "/",
    type: "promo",
  },
  {
    id: "banner-2",
    title: "Flash Sale - Up to 40% Off",
    subtitle: "Limited time offers on electronics",
    image:
      "https://placehold.co/800x400/FF6D00/FFFFFF?text=Flash+Sale+-+Up+to+40%25+Off",
    link: "/deals",
    type: "sale",
  },
  {
    id: "banner-3",
    title: "Made In Rwanda Collection",
    subtitle: "Support local artisans and craftspeople",
    image:
      "https://placehold.co/800x400/1565C0/FFFFFF?text=Made+In+Rwanda+Collection",
    link: "/categories/made-in-rwanda",
    type: "category",
  },
  {
    id: "banner-4",
    title: "Free Delivery on Orders Over 50,000 RWF",
    subtitle: "Fast & reliable shipping nationwide",
    image:
      "https://placehold.co/800x400/00838F/FFFFFF?text=Free+Delivery+Over+50%2C000+RWF",
    link: "/info/shipping",
    type: "promo",
  },
  {
    id: "banner-5",
    title: "New Arrivals - Fashion Collection",
    subtitle: "Discover the latest trends",
    image:
      "https://placehold.co/800x400/7B1FA2/FFFFFF?text=New+Arrivals+-+Fashion+Collection",
    link: "/categories/fashion",
    type: "category",
  },
];
