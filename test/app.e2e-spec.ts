import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  INestMicroservice,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { afterAll, beforeAll, describe, it } from '@jest/globals';
import { Server } from 'http';
import request from 'supertest';
import { OrdersModule } from '../src/modules/orders/orders.module';
import { InventoryModule } from '../src/modules/inventory/inventory.module';

type TestMicroservice = {
  listen: () => Promise<void>;
  close: () => Promise<void>;
};

describe('Orders + Inventory Microservice (e2e)', () => {
  let app: INestApplication<Server>;
  let inventoryMicroservice: TestMicroservice;

  beforeAll(async () => {
    const inventoryModule: TestingModule = await Test.createTestingModule({
      imports: [InventoryModule],
    }).compile();

    inventoryMicroservice = inventoryModule.createNestMicroservice<
      MicroserviceOptions,
      INestMicroservice
    >({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    });

    await inventoryMicroservice.listen();

    const ordersModule: TestingModule = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();

    app = ordersModule.createNestApplication();
    await app.init();
  });

  it('/orders/create should place order when stock is enough', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/orders/create')
      .send({ productId: 1, quantity: 2 })
      .expect(201)
      .expect({ code: 200, message: '下单成功，库存已扣减' });
  });

  it('/orders/create should reject order when stock is insufficient', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/orders/create')
      .send({ productId: 1, quantity: 101 })
      .expect(201)
      .expect({ code: 400, message: '下单失败', detail: '库存不足' });
  });

  afterAll(async () => {
    await app.close();
    await inventoryMicroservice.close();
  });
});
