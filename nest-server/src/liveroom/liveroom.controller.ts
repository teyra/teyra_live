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

@Controller('liveroom')
export class LiveroomController {
  constructor(private readonly liveroomService: LiveroomService) { }
  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createLiveroomDto: CreateLiveroomDto,
    @CurrentUser() user: DocumentType<User>,
  ) {
    return this.liveroomService.create(createLiveroomDto, user);
  }

  @Get('status/:id')
  @UseGuards(AuthGuard('jwt'))
  getLiveStatus(@Param('id') id: string) {
    return this.liveroomService.getLiveStatus(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.liveroomService.findOne(id);
  }

  @Get('my:id')
  @UseGuards(AuthGuard('jwt'))
  findMy(@Param('id') id: string) {
    console.log('12313132');
    // return this.liveroomService.findMy(user);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLiveroomDto: UpdateLiveroomDto,
  ) {
    return this.liveroomService.update(+id, updateLiveroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveroomService.remove(+id);
  }
}
