import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDTO{
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    displayname?: string;
}