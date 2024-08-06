import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/User.dto';
import { ValidationPipe } from '@nestjs/common';
import {
  returnErrorResponse,
  returnSuccessResponse,
} from 'src/common/returnResponse.common';
import { response } from 'express';
import { UpdateUserDTO } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDTO) {
    try {
      const userCreated = await this.usersService.createUser(createUserDto);

      if (!userCreated?.success) {
        return returnErrorResponse({
          status: false,
          statusCode: userCreated?.statusCode,
          error: userCreated?.message,
        });
      }
      return returnSuccessResponse({
        status: true,
        statusCode: userCreated.statusCode,
        message: userCreated.message,
        data: userCreated?.data,
      });
    } catch (error) {
      return returnErrorResponse({
        status: false,
        statusCode: 400,
        error: 'Something went wrong while creating new user.',
      });
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string){
    try {
        const userDataById = await this.usersService.getUserById(id);
        if(!userDataById.success){
            return returnErrorResponse({
                status: false,
                error: userDataById?.message,
                statusCode: userDataById?.statusCode,
            });
        }
        return returnSuccessResponse({
            status: true,
            message: userDataById?.message,
            data: userDataById?.data,
            statusCode: userDataById?.statusCode,
        })
    } catch (error) {
        return returnErrorResponse({
            status: false,
            error: error.toString(),
            statusCode: 400,
        });
    }
  }

  @Get()
  async getUsers(){
    try {
        
        const userData = await this.usersService.getUser();
        
        if(!userData.success){
           return returnErrorResponse({
                status: false,
                statusCode: userData?.statusCode,
                message: userData?.message,
            })
        }
        return returnSuccessResponse({
            status: true,
            statusCode: userData?.statusCode,
            message: userData?.message,
            data: userData?.data
        })
    } catch (error) {
        return returnErrorResponse({
            status: false,
            statusCode: 400,
            error: 'Something went wrong while fetching users.',
          });
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO){
    try {
        const userUpdated = await this.usersService.updateUser(id, updateUserDto);
        if(!userUpdated){
            return returnErrorResponse({
                error: userUpdated?.message,
                status: false,
                statusCode: userUpdated?.statusCode,
            });
        }
        return returnSuccessResponse({
            data: userUpdated?.data,
            status: true,
            statusCode: userUpdated?.statusCode,
            message: userUpdated?.message,
        });
    } catch (error) {
        return returnErrorResponse({
            error: error?.toString(),
            status: false,
            statusCode: 400,
        });
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string){
    try {
        const userDeleted = await this.usersService.deleteUser(id);
        if(!userDeleted?.success){
            return returnErrorResponse({
                status: false,
                statusCode: userDeleted?.statusCode,
                error: userDeleted?.message,
            })
        }
        return returnSuccessResponse({
            data: userDeleted?.data,
            status: true,
            statusCode: userDeleted?.statusCode,
            message: userDeleted?.message,
        })
    } catch (error) {
        return returnErrorResponse({
            error: error?.toString(),
            status: false,
            statusCode: 400
        })
    }
  }
}
