import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestContextModule } from 'src/shared/helpers/request-context';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {
  CLIENT_KEY_MIDTRANS,
  ID_MERCHANT_MIDTRANS,
  ISGLOBAL_MIDTRANS,
  SENDBOX_MIDTRANS,
  SERVER_KEY_MIDTRANS,
  USE_REDIS,
} from 'src/shared/constants/global.constants';
import { MidtransModule } from '@ruraim/nestjs-midtrans';

import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GLOBAL_CONFIG } from '../../configs/global.config';
import { LoggerModule } from '../logger/logger.module';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { MasterConstModule } from '../master-const/master-const.module';
import { ProductModule } from '../product/product.module';
import { TransactionModule } from '../transaction/transaction.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    UserModule,
    MasterConstModule,
    ProductModule,
    TransactionModule,
    RequestContextModule,
    MidtransModule.registerAsync({
      useFactory: async () => ({
        clientKey: CLIENT_KEY_MIDTRANS,
        serverKey: SERVER_KEY_MIDTRANS,
        merchantId: ID_MERCHANT_MIDTRANS,
        sandbox: SENDBOX_MIDTRANS, // default: false,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
      isGlobal: ISGLOBAL_MIDTRANS, // default: false, register module globally
    }),
    ...(USE_REDIS
      ? [
          CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
              store: await redisStore({
                socket: {
                  host: GLOBAL_CONFIG.redis.host,
                  port: GLOBAL_CONFIG.redis.port,
                },
              }),
            }),
          }),
        ]
      : [
          CacheModule.register({
            isGlobal: true,
          }),
        ]),
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
