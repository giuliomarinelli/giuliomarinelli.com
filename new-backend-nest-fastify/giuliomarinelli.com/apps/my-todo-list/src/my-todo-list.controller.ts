import { Controller, Get } from '@nestjs/common';
import { MyTodoListService } from './my-todo-list.service';

@Controller()
export class MyTodoListController {
  constructor(private readonly myTodoListService: MyTodoListService) {}

  @Get()
  getHello(): string {
    return this.myTodoListService.getHello();
  }
}
