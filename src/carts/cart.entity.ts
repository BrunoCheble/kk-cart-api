import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './interfaces/cartitem';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  shoppingCartId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  totalPrice: number;

  @Column({ nullable: false })
  totalQuantity: number;

  @Column('simple-json')
  products: CartItem[];
}
