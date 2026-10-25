export interface Booking {
  _id?: string;
  id: string;
  destinationName: string;
  destinationId?: string;
  departureDate?: string;
  travelDate?: string;
  price?: number | string;
  totalPrice?: number | string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Complete";
  imageUrl?: string;
  userEmail?: string;
  customerEmail?: string;
  userName?: string;
  customerName?: string;
  guests?: number;
  createdAt?: string | Date;
}

