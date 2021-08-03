import { Serialize } from './../interceptors/serialize.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async create(@Body() body: CreateUserDto): Promise<void> {
    this.usersService.create(body.email, body.password);
    return;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  async findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }
}
