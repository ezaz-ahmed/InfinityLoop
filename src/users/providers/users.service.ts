import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  constructor() {}

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        age: 40,
      },
    ];
  }
}
