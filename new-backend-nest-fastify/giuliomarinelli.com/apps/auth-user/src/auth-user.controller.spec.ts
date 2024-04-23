import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';

describe('AuthUserController', () => {
  let authUserController: AuthUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [AuthUserService],
    }).compile();

    authUserController = app.get<AuthUserController>(AuthUserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authUserController.getHello()).toBe('Hello World!');
    });
  });
});
