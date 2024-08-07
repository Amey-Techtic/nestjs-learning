import { IsBoolean , IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateUsersSettingsDto{
    
    @IsOptional()
    @IsBoolean()
    recieveNotifications?: boolean;
    
    @IsOptional()
    @IsBoolean()
    recieveEmails?: boolean;

    @IsOptional()
    @IsBoolean()
    recieveSMS?: boolean;

}
export class CreateUserDTO{
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    displayname?: string;

    @IsOptional()
    @ValidateNested()
    settings?: CreateUsersSettingsDto;   
}