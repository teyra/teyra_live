import { setGlobalOptions } from '@typegoose/typegoose';
setGlobalOptions({
  schemaOptions: {
    timestamps: true,
  },
});
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { DbModule } from '@app/db';
import { ConfigModule } from '@nestjs/config';
import { LiveroomModule } from './liveroom/liveroom.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { LiveUserRoleModule } from './live-user-role/live-user-role.module';
import { MeetingModule } from './meeting/meeting.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule.forRoot(),
    DbModule.forFeature(),
    MessageModule,
    UserModule,
    GroupModule,
    LiveroomModule,
    AuthModule,
    RedisModule,
    LiveUserRoleModule,
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
