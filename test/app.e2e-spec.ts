import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CartsModule } from '../src/carts/carts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Cart } from 'src/carts/cart.entity';

describe('Carts - /carts (e2e)', () => {
  const productId = 123456;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          database: process.env.DB_NAME,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
        }),
        CartsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get a cart [GET /:id]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    return request(app.getHttpServer())
      .get(`/carts/${shoppingCartId}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('shoppingCartId');
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('totalPrice');
        expect(body).toHaveProperty('totalQuantity');
        expect(body).toHaveProperty('products');
      });
  });

  it('Add a product to a new cart [POST /to-add-cart]', () => {
    return request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty('shoppingCartId');
        expect(body).toHaveProperty('products');
      });
  });

  it('Add a product to an existing cart [POST /to-add-cart]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    return request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(201)
      .then(({ body }) => {
        const { products } = body as Cart;
        const [product] = products;
        expect(product.quantity).toBe(2);
      });
  });

  it('Remove a product from a cart [PATCH /remove-from-cart]', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
      })
      .expect(201);

    const { shoppingCartId } = body as Cart;

    await request(app.getHttpServer())
      .post('/carts/add-to-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch('/carts/remove-from-cart')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({
        productId,
        shoppingCartId,
      })
      .expect(200)
      .then(({ body }) => {
        const { products } = body as Cart;
        const [product] = products;
        expect(product.quantity).toBe(1);
      });
  });
});
