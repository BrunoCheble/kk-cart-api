import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateCartProductBody } from './dtos/create-cartproduct';
import { CartItem } from './interfaces/cartitem';
import { UpdateCartItem } from './dtos/update-cartitem';
import { CreateNewCart } from './dtos/create-newcart';
import { SaveCart } from './dtos/savecart';
import { RemoveCartProductBody } from './dtos/remove-cartproduct';
import { FindOneCart } from './dtos/findone-cart';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
  ) {}

  async delete(shoppingCartId: number): Promise<void> {
    await this.cartsRepository.delete(shoppingCartId);
  }

  findOne(data: FindOneCart): Promise<Cart> {
    return this.cartsRepository.findOneBy(data);
  }

  async removeCartProduct({
    shoppingCartId,
    product,
  }: RemoveCartProductBody): Promise<Cart | void> {
    const { productId, price } = product;
    const cart = await this.findOne({ shoppingCartId });

    if (!cart) {
      throw new HttpException('Cart not found!', 400);
    }

    const products = this.updateCartItems({
      cartItems: cart.products,
      product,
      removeItem: true,
    }).filter((item) => !(item.productId === productId && item.quantity === 0));

    if (products.length > 0) {
      return this.saveCart({ cart, products });
    }

    await this.delete(shoppingCartId);
  }

  async addToCart({
    shoppingCartId,
    product,
    userId,
  }: CreateCartProductBody): Promise<Cart> {
    const { productId, price } = product;
    const cart = await this.findOrCreateNewOne({
      shoppingCartId,
      userId,
    });

    const products = this.updateCartItems({
      cartItems: cart.products,
      product,
    });

    if (!products.some((item) => item.productId === productId)) {
      products.push({ productId, quantity: 1, price });
    }

    return this.saveCart({ cart, products });
  }

  private async findOrCreateNewOne({
    shoppingCartId,
    userId,
  }: CreateNewCart): Promise<Cart> {
    if (!shoppingCartId) {
      return this.cartsRepository.create({
        shoppingCartId,
        userId,
        totalPrice: 0,
        totalQuantity: 0,
        products: [],
      });
    }

    const cart = await this.cartsRepository.findOneBy({
      shoppingCartId,
      userId,
    });

    if (!cart) {
      throw new HttpException('Cart not found!', 400);
    }

    return cart;
  }

  private updateCartItems({
    cartItems,
    product,
    removeItem,
  }: UpdateCartItem): CartItem[] {
    return cartItems.reduce<CartItem[]>((acc, curr) => {
      if (+curr.productId === product.productId) {
        curr.quantity += removeItem ? -1 : 1;
        curr.price = curr.quantity * product.price;
      }
      return acc.concat(curr);
    }, []);
  }

  private async saveCart({ products, cart }: SaveCart): Promise<Cart> {
    cart.products = products;
    cart.totalPrice = cart.products.reduce((acc, curr) => acc + curr.price, 0);
    cart.totalQuantity = cart.products.reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );
    return this.cartsRepository.save(cart);
  }
}
