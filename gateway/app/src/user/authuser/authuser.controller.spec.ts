import { Test, TestingModule } from '@nestjs/testing';
import { AuthuserController } from './authuser.controller';

describe('AuthuserController', () => {
  let controller: AuthuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthuserController],
    }).compile();

    controller = module.get<AuthuserController>(AuthuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
