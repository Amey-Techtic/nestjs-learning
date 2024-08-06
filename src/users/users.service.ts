import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDTO } from './dto/User.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDTO) {
    try {
      const newUser = new this.userModel(createUserDto);
      const userCreated = await newUser.save();
      if (!userCreated) {
        return {
          data: null,
          success: false,
          message: 'Something went wrong while creating user.',
          statusCode: 400,
        };
      }
      return {
        data: null,
        success: true,
        message: 'User created successfully.',
      };
    } catch (error) {
      const msg =
        error.errorResponse.code === 11000
          ? `Duplicate fields not allowed: ${Object.keys(error.errorResponse.keyValue)}`
          : `Internal server error`;

      return {
        data: null,
        success: false,
        message: msg.toString(),
        statusCode: 500,
      };

      // throw error; // rethrow other errors
    }
  }

  async getUser(){
      try {
          const userData: any[] = await this.userModel.find();
          if(userData?.length === 0 || !userData){
              return {
                  data: null,
                  success: false,
                  message: 'Something went wrong while getting users.',
                  statusCode: 404,
                };
          }
          return {
              data: userData,
              success: true,
              message: "Fetched users successfully.",
              statusCode: 200,
          }
        
    } catch (error) {
        return {
            data: null,
            success: false,
            message: error.toString(),
            statusCode: 500,
          };
    }
  }

  async getUserById(id: string){
    try {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if(!isValidId) throw new Error("User not found");
        const userById = await this.userModel.findById(id);
        if(!userById){
            return {
                statusCode: 404,
                success: false,
                message: "User not found.",
            }
        }
        return {
            success: true,
            statusCode: 200,
            message: "Fetched user successfully.",
            data: userById,
        }
    } catch (error) {
        return{
            success: false,
            statusCode: 500,
            message: error.toString(),
        }
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO){
    try {
        const userDataUpdated = await this.userModel.findByIdAndUpdate({_id: id}, updateUserDto, {new: true});
        if(!userDataUpdated){
            return{
                message: "Unable to update user data",
                statusCode: 400,
                success: false,
            }
        }
        return {
            message: "User data updated successfully!",
            statusCode: 200,
            success: true,
            data: userDataUpdated
        }
    } catch (error) {
        return {
            message: error.toString(),
            statusCode: 500,
            success: false
        }
    }
  }

  async deleteUser(id: string){
    try {
        const userDeleted = await this.userModel.findByIdAndDelete(id);
        if(!userDeleted){
            return {
                message: "Not able to delete user.",
                success: false,
                statusCode: 400,
            }
        }
        return {
            message: "User deleted successfully.",
            success: false,
            statusCode: 200,
            data: userDeleted,
        }
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: error.toString(),
        }
    }
  }
}
