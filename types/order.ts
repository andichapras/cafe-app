export interface OrderItemRequest {
  menuId: number;
  qty: number;
}

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  qty: number;
}
