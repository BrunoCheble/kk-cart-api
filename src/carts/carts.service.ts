import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CreateCartProductBody } from './dtos/create-cartproduct';
import { Product } from './interfaces/product';
import { CartItem } from './interfaces/cartitem';
import { UpdateCartItem } from './dtos/update-cartitem';
import { CreateNewCart } from './dtos/create-newcart';
import { SaveCart } from './dtos/savecart';
import { RemoveCartProductBody } from './dtos/remove-cartproduct';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);
  private readonly userId = 1;
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    private readonly httpService: HttpService,
  ) {}

  async delete(shoppingCartId: number): Promise<void> {
    await this.cartsRepository.delete(shoppingCartId);
  }

  findOne(shoppingCartId: number): Promise<Cart> {
    return this.cartsRepository.findOneBy({
      shoppingCartId,
      userId: this.userId,
    });
  }

  async removeCartProduct({
    shoppingCartId,
    productId,
  }: RemoveCartProductBody): Promise<Cart | void> {
    const cart = await this.findOne(shoppingCartId);

    if (!cart) {
      throw new HttpException('Cart not found!', 400);
    }

    const product = await this.findProduct(productId);
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
    productId,
  }: CreateCartProductBody): Promise<Cart> {
    const product = await this.findProduct(productId);
    const cart = await this.findOrCreateNewOne({
      shoppingCartId,
      userId: this.userId,
    });

    const products = this.updateCartItems({
      cartItems: cart.products,
      product,
    });

    if (!products.some((item) => item.productId === productId)) {
      products.push({ productId, quantity: 1, price: product.price });
    }

    return this.saveCart({ cart, products });
  }

  private async findProduct(productId: number): Promise<Product> {
    const { data: product } = await firstValueFrom(
      this.httpService
        .get<Product>(`${process.env.URL_PRODUCT_API}/products/${productId}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    if (!product) {
      throw new HttpException('Product not found!', 400);
    }

    return product;
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
