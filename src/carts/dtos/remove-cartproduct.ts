import { IsNotEmpty } from 'class-validator';

export class RemoveCartProductBody {
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  shoppingCartId: number;
  @IsNotEmpty()
  userId: number;
}
