import { CartItem } from '../interfaces/cartitem';
import { Product } from '../interfaces/product';

export class UpdateCartItem {
  cartItems: CartItem[];
  product: Product;
  removeItem?: boolean;
}
