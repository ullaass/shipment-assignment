
export interface ShipmentEvent {
  id: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  productName: string;
  status: string;
  createdAt: string;
  events: ShipmentEvent[];
}
