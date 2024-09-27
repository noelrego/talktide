import { IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CheckUserNameDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 32, {message: 'User Name should be between 2 to 32 chars'})
    @Matches(/^[a-z0-9_-]+$/, { message: 'User Name should have small letters, numbers, underscores, and hyphens.'})
    userName: string;
}

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 32, {message: 'User Name should be between 2 to 32 chars'})
    @Matches(/^[a-z0-9_-]+$/, { message: 'User Name should have small letters, numbers, underscores, and hyphens.'})
    userName: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 32, {message: 'First Name should be between 2 to 32 chars'})
    firstName: string;

    @IsString()
    @IsOptional()
    @Length(1, 32, {message: 'Last Name should be between 1 to 32 chars'})
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 32, {message: 'Password should be between 6 to 32 chars'})
    password: string;
}

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 32, {message: 'User Name should be between 2 to 32 chars'})
    @Matches(/^[a-z0-9_-]+$/, { message: 'User Name should have small letters, numbers, underscores, and hyphens.'})
    userName: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 32, {message: 'Password should be between 6 to 32 chars'})
    password: string;
}