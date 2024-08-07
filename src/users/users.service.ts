import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDTO } from './dto/User.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { UserSettings } from 'src/schemas/UserSettings.schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDTO) {
    try {
      if (settings) {
        if(!settings?.recieveEmails || !settings?.recieveNotifications || !settings?.recieveSMS){
          return {
            success: false,
            statusCode: 400,
            message: "Settings are required!"
          }
        }
        const newSettings = new this.userSettingsModel(settings);
        const savedNewSettings = await newSettings.save();
        const newUser = new this.userModel({
          ...createUserDto,
          settings: savedNewSettings._id,
        });
        const savedNewUser = await newUser.save();
        if(!savedNewUser){
          
          return {
            success: false,
            message: 'Something went wrong while creating user.',
            statusCode: 400,
          };
        }
        return {
          data: savedNewUser,
          success: true,
          message: 'User created successfully.',
          statusCode: 200,
        };
      }

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
    }
  }

  async getUser(search: string) {
    try {
      const query = search !== '' ? { username: search } : {};
      const userData: any[] = await this.userModel.find(query).populate(["settings","posts"]);
      if (userData?.length === 0) {
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
        message: 'Fetched users successfully.',
        statusCode: 200,
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        message: error.toString(),
        statusCode: 500,
      };
    }
  }

  async getUserById(id: string) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) throw new Error('User not found');
      const userById = await this.userModel.findById(id).populate('settings');
      if (!userById) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found.',
        };
      }
      return {
        success: true,
        statusCode: 200,
        message: 'Fetched user successfully.',
        data: userById,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.toString(),
      };
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) throw new Error('User not found.');
      const userDataUpdated = await this.userModel.findByIdAndUpdate(
        { _id: id },
        updateUserDto,
        { new: true },
      );
      if (!userDataUpdated) {
        return {
          message: 'Unable to update user data',
          statusCode: 400,
          success: false,
        };
      }
      return {
        message: 'User data updated successfully!',
        statusCode: 200,
        success: true,
        data: userDataUpdated,
      };
    } catch (error) {
      return {
        message: error.toString(),
        statusCode: 500,
        success: false,
      };
    }
  }

  async deleteUser(id: string) {
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) throw new Error('User not found.');
      const userDeleted = await this.userModel.findByIdAndDelete(id);
      if (!userDeleted) {
        return {
          message: 'Not able to delete user.',
          success: false,
          statusCode: 400,
        };
      }
      return {
        message: 'User deleted successfully.',
        success: false,
        statusCode: 200,
        data: userDeleted,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.toString(),
      };
    }
  }
}
