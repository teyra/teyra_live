import { PartialType } from '@nestjs/swagger';
import { CreateLiveUserRoleDto } from './create-live-user-role.dto';

export class UpdateLiveUserRoleDto extends PartialType(CreateLiveUserRoleDto) {}
