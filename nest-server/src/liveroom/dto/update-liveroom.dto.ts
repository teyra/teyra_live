import { PartialType } from '@nestjs/swagger';
import { CreateLiveroomDto } from './create-liveroom.dto';

export class UpdateLiveroomDto extends PartialType(CreateLiveroomDto) {}
