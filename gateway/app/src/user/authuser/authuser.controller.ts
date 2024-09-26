import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthuserService } from './authuser.service';
import { Response } from 'express';
import { LoginUserDto, RegisterUserDto } from 'src/dto';

@Controller('user')
export class AuthuserController {

    constructor (
        private userService: AuthuserService
    ) {}

    /**
     * POST /api/user/register
     */
    @Post('register')
    async registerUser(@Res() res: Response, @Body() dto: RegisterUserDto) {
        const response = await this.userService.registerUserService(dto);
        return res.status(response.statusCode).json(response);
    }

    /** 
     * GET /api/user
     */
    @Get()
    async getAllUsers(@Res() res: Response) {
        const response = await this.userService.getAllUserService();
        return res.status(response.statusCode).json(response);
    }


    /**
     * POST /api/user/login
     */
    @Post('login')
    async loginAuthUser(@Res() res: Response, @Body() dto: LoginUserDto) {
        const response = await this.userService.loginAuthUserService(dto);
        return res.status(response.statusCode).json(response);
    }

    
}
