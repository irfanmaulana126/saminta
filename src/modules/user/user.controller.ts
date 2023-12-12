import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { ApiPaginatedResponse } from 'src/decorators/pagination.decorator';
import { PaginatedModelReponseDTO } from 'src/shared/dto/paginated-output.dto';
import { SingleModelResponseDTO } from 'src/shared/dto/single-output.dto';
import {
  PaginatedInputDTO,
  PaginatedInputQuery,
} from 'src/shared/dto/paginated-input.dto';

import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { UserRoles } from '../auth/auth.roles.decorator';
import { ROLES } from '../../shared/constants/global.constants';

import { UserService } from './user.service';
import {
  UserCreateFormDTO,
  UserFilterDTO,
  UserUpdateFormDTO,
} from './user.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get all users' })
  @ApiPaginatedResponse(PaginatedModelReponseDTO<User>)
  async getAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: UserFilterDTO,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<User>> {
    const users = await this.userService.users(query);
    return res.status(200).send({
      message: users.data.length > 0 ? 'success' : 'users not found',
      data: users.data,
      meta: users.meta,
    });
  }

  @Get('/roles')
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get roles list' })
  @ApiQuery({ type: PaginatedInputDTO })
  @ApiPaginatedResponse(PaginatedModelReponseDTO<Role>)
  async getRoles(
    @Query() query: PaginatedInputQuery,
    @Response() res,
  ): Promise<PaginatedModelReponseDTO<Role>> {
    const roles = await this.userService.roles(query);
    return res.status(200).send({
      message: roles.data.length > 0 ? 'success' : 'roles not found',
      data: roles.data,
      meta: roles.meta,
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get user by id' })
  @ApiResponse({ type: SingleModelResponseDTO<User> })
  async getById(
    @Param('id') id: string,
    @Response() res,
  ): Promise<SingleModelResponseDTO<User>> {
    const user = await this.userService.userById(id);
    return res.status(user ? 200 : 404).send({
      message: user ? 'success' : 'user not found',
      data: user,
    });
  }

  @Post()
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Register user' })
  @ApiBody({ type: UserCreateFormDTO })
  @ApiResponse({ type: SingleModelResponseDTO<User> })
  async register(
    @Body() user: UserCreateFormDTO,
    @Response() res,
  ): Promise<SingleModelResponseDTO<User>> {
    let createdUser = null;
    try {
      createdUser = await this.userService.createUser(user);
    } catch (error) {
      return res.status(400).send({ message: error.message, data: null });
    }

    return res.status(201).send({
      message: 'Register success',
      data: createdUser,
    });
  }

  @Put('/:id')
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Update user organization' })
  @ApiResponse({ type: SingleModelResponseDTO<User> })
  async update(
    @Param('id') id: string,
    @Body() user: UserUpdateFormDTO,
    @Response() res,
  ): Promise<SingleModelResponseDTO<User>> {
    let updatedUser = null;
    try {
      updatedUser = await this.userService.updateUser(id, user);
    } catch (error) {
      return res.status(error.code == 'P2025' ? 404 : 400).send({
        message: error.message,
        data: null,
      });
    }

    return res.status(200).send({
      message: 'success',
      data: updatedUser,
    });
  }

  @Delete('/:id')
  @UserRoles(ROLES['superadmin'], ROLES['streamer'])
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Delete user' })
  @ApiResponse({})
  async delete(@Param('id') id: string, @Response() res) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      return res.status(error.code == 'P2025' ? 404 : 400).send({
        message: error.message,
        data: null,
      });
    }

    return res.status(204).send({});
  }

  // @Post('user')
  // async signupUser(
  //   @Body()
  //   userData: {
  //     name?: string;
  //     email: string;
  //     password: string;
  //     role: Role;
  //   },
  // ): Promise<User> {
  //   return this.userService.createUser(userData);
  // }
}
