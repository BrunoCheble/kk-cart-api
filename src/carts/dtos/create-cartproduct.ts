import { IsNotEmpty } from 'class-validator';

export class CreateCartProductBody {
  @IsNotEmpty()
  productId: number;
  shoppingCartId?: number;
  @IsNotEmpty()
  userId: number;
}
