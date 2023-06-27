import { Test, TestingModule } from '@nestjs/testing';
import { LiveroomService } from './liveroom.service';

describe('LiveroomService', () => {
  let service: LiveroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveroomService],
    }).compile();

    service = module.get<LiveroomService>(LiveroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
