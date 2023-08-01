import { Test, TestingModule } from '@nestjs/testing';
import { MeetingGateway } from './meeting.gateway';
import { MeetingService } from './meeting.service';

describe('MeetingGateway', () => {
  let gateway: MeetingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingGateway, MeetingService],
    }).compile();

    gateway = module.get<MeetingGateway>(MeetingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
