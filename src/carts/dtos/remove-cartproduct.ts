import { IsNotEmpty } from 'class-validator';
import { Product } from '../interfaces/product';

export class RemoveCartProductBody {
  @IsNotEmpty()
  product: Product;
  @IsNotEmpty()
  shoppingCartId: number;
  @IsNotEmpty()
  userId: number;
}
