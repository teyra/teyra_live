import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { DocumentType } from '@typegoose/typegoose';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('meeting')
@ApiTags('会议')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}
  @Post('add')
  create(
    @Body() createLiveroomDto: CreateMeetingDto,
    @CurrentUser() user: DocumentType<User>,
  ) {
    console.log(user, 'user');

    // return this.meetingService.create(createLiveroomDto, user);
  }
}
