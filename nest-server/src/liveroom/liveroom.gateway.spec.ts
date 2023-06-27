import { Test, TestingModule } from '@nestjs/testing';
import { LiveroomGateway } from './liveroom.gateway';

describe('LiveroomGateway', () => {
  let gateway: LiveroomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveroomGateway],
    }).compile();

    gateway = module.get<LiveroomGateway>(LiveroomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
