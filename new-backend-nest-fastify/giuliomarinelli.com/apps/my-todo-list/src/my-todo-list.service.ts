import { Injectable } from '@nestjs/common';

@Injectable()
export class MyTodoListService {
  getHello(): string {
    return 'Hello World!';
  }
}
