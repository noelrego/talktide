import { Body, Controller, Post, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { Response } from 'express';
import { CreateMemberDto } from 'src/dto';

@Controller('message')
export class MessageController {

    constructor (
        private messageService: MessageService
    ) {}


    /**
     * POST /api/message/create-member
     */
    @Post('create-member')
    async createmember(@Res() res: Response, @Body() dto: CreateMemberDto) {
        const response = await this.messageService.createMemberService(dto);
        return res.status(response.statusCode).json(response);
    }
}
