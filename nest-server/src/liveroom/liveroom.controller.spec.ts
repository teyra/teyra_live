import { Test, TestingModule } from '@nestjs/testing';
import { LiveroomController } from './liveroom.controller';
import { LiveroomService } from './liveroom.service';

describe('LiveroomController', () => {
  let controller: LiveroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveroomController],
      providers: [LiveroomService],
    }).compile();

    controller = module.get<LiveroomController>(LiveroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
