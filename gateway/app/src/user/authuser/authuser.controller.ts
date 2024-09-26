import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthuserService } from './authuser.service';
import { Response } from 'express';
import { RegisterUserDto } from 'src/dto';

@Controller('user')
export class AuthuserController {

    constructor (
        private userService: AuthuserService
    ) {}

    /** 
     * GET /api/user
     */
    @Get()
    getAllUsers(@Res() res: Response) {
        const response = this.userService.getAllUserService();
        return res.status(200).json(response);
    }

    /**
     * POST /api/user/register
     */
    @Post('register')
    registerUser(@Res() res: Response, @Body() dto: RegisterUserDto) {
        const response = this.userService.registerUserService(dto);
        return res.status(200).json(response);
    }
}
