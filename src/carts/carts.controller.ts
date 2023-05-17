import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CreateCartProductBody } from './dtos/create-cartproduct';
import { RemoveCartProductBody } from './dtos/remove-cartproduct';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cart> {
    return this.cartsService.findOne(id);
  }

  @Post('add-to-cart')
  async addToCart(@Body() body: CreateCartProductBody): Promise<any> {
    return this.cartsService.addToCart(body);
  }

  @Patch('remove-from-cart')
  async removeFromCart(@Body() body: RemoveCartProductBody): Promise<any> {
    return this.cartsService.removeCartProduct(body);
  }
}
