import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { entities } from './entities';
import { RedisService } from 'src/redis/redis.service';
@Module({
  providers: [RedisService],
})
export class DbModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'DB_CONNECTION',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const uri = configService.get<string>('DB_URL');
          return mongoose.connect(uri);
        },
      },
    ];
    return {
      module: DbModule,
      providers,
      exports: providers,
      global: true,
    };
  }
  static forFeature(): DynamicModule {
    const providers: Provider[] = entities.map((entity) => {
      return {
        provide: entity.name,
        useFactory: () => getModelForClass(entity),
      } as Provider;
    });
    return {
      module: DbModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}
