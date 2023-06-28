import { Test, TestingModule } from '@nestjs/testing';
import { LiveUserRoleService } from './live-user-role.service';

describe('LiveUserRoleService', () => {
  let service: LiveUserRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveUserRoleService],
    }).compile();

    service = module.get<LiveUserRoleService>(LiveUserRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
