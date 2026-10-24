export interface Destination {
  _id?: string;
  id?: string | number;
  slug?: string;
  destinationName?: string;
  name?: string;
  title?: string;
  country?: string;
  category?: string;
  price?: number | string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  image?: string;
  description?: string;
  overview?: string;
  rating?: number | string;
  reviewsCount?: number | string;
  highlights?: string[];
  createdAt?: string | Date;
}

