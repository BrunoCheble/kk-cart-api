import { Cart } from '../cart.entity';
import { CartItem } from '../interfaces/cartitem';

export class SaveCart {
  products: CartItem[];
  cart: Cart;
}
