import { CreateUserDTO } from "./User.dto";
import {PartialType} from "@nestjs/mapped-types"; 

export class UpdateUserDTO extends PartialType(CreateUserDTO){}