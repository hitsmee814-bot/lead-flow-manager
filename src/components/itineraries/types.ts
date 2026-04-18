export type PackageInfo = {
  title: string;
  description: string;
  durationDays: number;
  durationNights: number;
  originCity: string;
  destination: string;
  basePrice: number;
  currency: string;
  maxGuests: number;
  status: "draft" | "active" | "inactive";
};

export type ItineraryFormData = {
  packageInfo: PackageInfo;
};
