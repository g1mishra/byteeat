export type Cart = {
  id: string
  name: string
  price: number
  quantity: number
  portion?: string
  isVeg?: boolean
  addons?: {
    id: string
    name?: string
    price?: number
  }[]
}

// Add this type if it doesn't exist
export type OrderItemAddon = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Update the OrderItem type
export type OrderItem = {
  id: string;
  name: string;
  itemId: string;
  portion?: string;
  price: number;
  quantity: number;
  orderId: string;
  addons?: OrderItemAddon[];
};

// Update the Order type if necessary
export type Order = {
  // ... other properties
  orderItems?: OrderItem[];
};
