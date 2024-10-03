import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { N_GenericResType, N_MsgPatternMessageService } from '@nn-rego/chatapp-common';
import { firstValueFrom } from 'rxjs';
import { MicroServiceName } from 'src/common';
import { CreateMemberDto } from 'src/dto';

@Injectable()
export class MessageService {

    private readonly logger = new Logger(MessageService.name);

    constructor (
        @Inject(MicroServiceName.MESSAGE_SERVICE) private messageClient: ClientProxy
    ) {}


    /**
     * Function to create Member 
     * @param dto 
     * @returns 
     */
    async createMemberService(dto: CreateMemberDto) : Promise<N_GenericResType> {

        console.log('IN Service', dto)
        const response : N_GenericResType = await firstValueFrom(
            this.messageClient.send(N_MsgPatternMessageService.CREATE_CHAT_MEMBER, dto)
        );

        if (response?.errors) {
            this.logger.error(response.errors);
            return {
                statusCode: response.statusCode,
                message: response.message
            }
        }

        return response;
    }
}
