import { Controller, Get, Param, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { Response } from 'express';
import { Public } from 'src/decorator';

@Controller('message')
export class MessageController {

    constructor (
        private messageService: MessageService
    ) {}


    /**
     * POST /api/message/create-member
     */
    @Get('chat-history/:id')
    async getChatHistory(@Res() res: Response, @Param('id') memberId: string) {
        const member = Number(memberId);
        const response = await this.messageService.getChatHistoryList(member);
        return res.status(response.statusCode).json(response);
    }
}
