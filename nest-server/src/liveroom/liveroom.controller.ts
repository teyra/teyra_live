import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LiveroomService } from './liveroom.service';
import { CreateLiveroomDto } from './dto/create-liveroom.dto';
import { UpdateLiveroomDto } from './dto/update-liveroom.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { DocumentType } from '@typegoose/typegoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('直播间')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LiveroomController {
  constructor(private readonly liveroomService: LiveroomService) {}
  @Post('liveroom/add')
  create(
    @Body() createLiveroomDto: CreateLiveroomDto,
    @CurrentUser() user: DocumentType<User>,
  ) {
    return this.liveroomService.create(createLiveroomDto, user);
  }

  @Get('liveroom/status/:id')
  getLiveStatus(@Param('id') id: string) {
    return this.liveroomService.getLiveStatus(id);
  }

  @Get('liveroom/:id')
  findOne(@Param('id') id: string) {
    return this.liveroomService.findOne(id);
  }

  @Get('myLiveroom')
  findMy(@CurrentUser() user: DocumentType<User>) {
    return this.liveroomService.findMy(user);
  }
  @Patch('liveroom/updateTitle/:id')
  update(
    @Param('id') id: string,
    @Body() updateLiveroomDto: UpdateLiveroomDto,
  ) {
    return this.liveroomService.update(id, updateLiveroomDto);
  }

  @Get('liveroom/UserRoleList/:id')
  getUserRoleList(@Param('id') id: string) {
    return this.liveroomService.getUserRoleList(id);
  }
}
