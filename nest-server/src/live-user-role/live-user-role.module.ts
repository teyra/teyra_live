import { Module } from '@nestjs/common';
import { LiveUserRoleService } from './live-user-role.service';
import { LiveUserRoleController } from './live-user-role.controller';

@Module({
  controllers: [LiveUserRoleController],
  providers: [LiveUserRoleService]
})
export class LiveUserRoleModule {}
