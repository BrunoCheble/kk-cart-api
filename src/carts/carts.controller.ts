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

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) shoppingCartId: number): Promise<Cart> {
    return this.cartsService.findOne({ shoppingCartId });
  }

  @Post('add-to-cart')
  async addToCart(@Body() body: CreateCartProductBody): Promise<Cart> {
    return this.cartsService.addToCart(body);
  }

  @Patch('remove-from-cart')
  async removeFromCart(
    @Body() body: RemoveCartProductBody,
  ): Promise<Cart | void> {
    return this.cartsService.removeCartProduct(body);
  }
}
