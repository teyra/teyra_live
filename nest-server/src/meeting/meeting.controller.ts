import { Get, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { DocumentType } from '@typegoose/typegoose';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller()
@ApiTags('会议')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}
  @Post('meeting/add')
  create(@CurrentUser() user: DocumentType<User>) {
    return this.meetingService.create(user);
  }
  @Get('meeting/:conferenceNumber')
  getDetail(@Param('conferenceNumber') conferenceNumber: number) {
    return this.meetingService.findOne(conferenceNumber);
  }
}
