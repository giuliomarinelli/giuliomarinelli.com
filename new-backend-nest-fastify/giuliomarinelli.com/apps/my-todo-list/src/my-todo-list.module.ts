import { Module } from '@nestjs/common';
import { MyTodoListController } from './my-todo-list.controller';
import { MyTodoListService } from './my-todo-list.service';

@Module({
  imports: [],
  controllers: [MyTodoListController],
  providers: [MyTodoListService],
})
export class MyTodoListModule {}
