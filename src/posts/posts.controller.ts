import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePostDto } from "./dtos/CReatePost.dto";
import { PostsService } from "./posts.service";
import { returnErrorResponse, returnSuccessResponse } from "src/common/returnResponse.common";

@Controller("posts")
export class PostsController{
    constructor(private postService: PostsService){}
    @Post()
    @UsePipes(new ValidationPipe())
    async createPost(@Body() createPostDto: CreatePostDto){
        try {
            const postCreated = await this.postService.createPost(createPostDto);
            if(!postCreated?.success){
                return returnErrorResponse({
                    message: postCreated?.message,
                    statusCode: postCreated?.statusCode,
                    status: postCreated?.success
                })
            }
            return returnSuccessResponse({
                message: postCreated?.message,
                status: postCreated?.success,
                statusCode: postCreated?.statusCode,
                data: postCreated?.data
            });
        } catch (error) {
            return returnErrorResponse({
                message: error.toString(),
                status: false,
                statusCode: 400,
            })
        }
    }
}