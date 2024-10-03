import { IsNotEmpty, IsString } from "class-validator";

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty()
    firstRecipient: string;

    @IsString()
    @IsNotEmpty()
    secondRecipient: string;
}