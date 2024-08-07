import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.Schema';
import { CreatePostDto } from './dtos/CReatePost.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({userId, ...createPostDto}: CreatePostDto) {
    try {
        
      const findUser = await this.userModel.findById(userId);
      if(!findUser) throw new Error("User not found.");
      const postCreated = new this.postsModel(createPostDto);
      const newPostSaved = await postCreated.save();
      const updatedUser = await findUser.updateOne({$push: {
        posts: newPostSaved._id,
      }});
      if(!updatedUser){
        return {
            success: false,
            message: "Unable to save user post.",
            statusCode: 400,
        }
      }
      if (!newPostSaved) {
        return {
          statusCode: 400,
          success: false,
          message: 'Unable to create user.',
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'User created successfully.',
        data: postCreated,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: error.toString(),
      };
    }
  }
}
