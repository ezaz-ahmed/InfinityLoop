import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('/:id?')
  public getUser(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(typeof getUserParamDto.id, getUserParamDto.id);
    console.log(typeof limit, limit);
    console.log(typeof page, page);

    return 'You get a get request';
  }

  @Post()
  public creaetUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    return 'You sent a post request to user endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
