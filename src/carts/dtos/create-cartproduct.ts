import { IsNotEmpty } from 'class-validator';
import { Product } from '../interfaces/product';

export class CreateCartProductBody {
  @IsNotEmpty()
  product: Product;
  shoppingCartId?: number;
  @IsNotEmpty()
  userId: number;
}
