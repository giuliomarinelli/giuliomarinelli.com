import { Test, TestingModule } from '@nestjs/testing';
import { MyTodoListController } from './my-todo-list.controller';
import { MyTodoListService } from './my-todo-list.service';

describe('MyTodoListController', () => {
  let myTodoListController: MyTodoListController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyTodoListController],
      providers: [MyTodoListService],
    }).compile();

    myTodoListController = app.get<MyTodoListController>(MyTodoListController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(myTodoListController.getHello()).toBe('Hello World!');
    });
  });
});
