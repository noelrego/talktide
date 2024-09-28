import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthuserService } from './authuser.service';
import { Response } from 'express';
import { CheckUserNameDto, LoginUserDto, RegisterUserDto } from 'src/dto';
import { GetAuthIdFromToken, GetAuthInfoFromToken, Public } from 'src/decorator';

@Controller('user')
export class AuthuserController {

    constructor (
        private userService: AuthuserService
    ) {}

    /**
     * POST /api/check-username
     */
    @Public()
    @Post('check-username')
    async checkuserName(@Res() res: Response, @Body() dto: CheckUserNameDto) {
        const response = await this.userService.checkUserNameService(dto);
        return res.status(response.statusCode).json(response);
    }

    /**
     * POST /api/user/register
     */
    @Public()
    @Post('register')
    async registerUser(@Res() res: Response, @Body() dto: RegisterUserDto) {
        const response = await this.userService.registerUserService(dto);
        return res.status(response.statusCode).json(response);
    }

    /** 
     * GET /api/user
     */
    @Get()
    async getAllUsers(@Res() res: Response, 
        @GetAuthIdFromToken() authId: string,
        @GetAuthInfoFromToken() authInfo: object    
    ) {
        console.log(authId, authInfo);
        const response = await this.userService.getAllUserService();
        return res.status(response.statusCode).json(response);
    }


    /**
     * POST /api/user/login
     */
    @Public()
    @Post('login')
    async loginAuthUser(@Res() res: Response, @Body() dto: LoginUserDto) {
        const response = await this.userService.loginAuthUserService(dto);
        return res.status(response.statusCode).json(response);
    }

    
}
