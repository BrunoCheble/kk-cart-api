import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CreateCartProductBody } from './dtos/create-cartproduct';
import { RemoveCartProductBody } from './dtos/remove-cartproduct';
import { User } from './user.decorator';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) shoppingCartId: number,
    @User() userId: number,
  ): Promise<Cart> {
    return this.cartsService.findOne({ shoppingCartId, userId });
  }

  @Post('add-to-cart')
  async addToCart(
    @Body() body: CreateCartProductBody,
    @User() userId: number,
  ): Promise<Cart> {
    return this.cartsService.addToCart({ ...body, userId });
  }

  @Patch('remove-from-cart')
  async removeFromCart(
    @Body() body: RemoveCartProductBody,
    @User() userId: number,
  ): Promise<Cart | void> {
    return this.cartsService.removeCartProduct({ ...body, userId });
  }
}
