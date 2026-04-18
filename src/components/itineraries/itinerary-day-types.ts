export type Activity = {
  id: string;
  name: string;
  type: string;
  description: string;
  lat: string;
  lng: string;
};

export type DayPlan = {
  id: string;
  date: string;
  description: string;
  distance: string;
  travelTime: string;
  hotel: string;
  from: string;
  to: string;
  activities: Activity[];
  images: File[];
  open?: boolean;
};