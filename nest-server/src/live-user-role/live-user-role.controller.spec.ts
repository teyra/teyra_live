import { Test, TestingModule } from '@nestjs/testing';
import { LiveUserRoleController } from './live-user-role.controller';
import { LiveUserRoleService } from './live-user-role.service';

describe('LiveUserRoleController', () => {
  let controller: LiveUserRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveUserRoleController],
      providers: [LiveUserRoleService],
    }).compile();

    controller = module.get<LiveUserRoleController>(LiveUserRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
