import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Cart])],
  providers: [CartsService],
  controllers: [CartsController],
})
export class CartsModule {}
