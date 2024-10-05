import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType } from '@nn-rego/chatapp-common';
import { In, Raw, Repository } from 'typeorm';
import { ChatHistoryType, CreateMemberType } from './common';
import { MessageRepo } from './entity/message.entity';

@Injectable()
export class AppService {
  
  private logger = new Logger(AppService.name);

  constructor (
    @InjectRepository(MessageRepo) private messageRepo : Repository<MessageRepo>,
  ) {}


  /**
   * Function to create chat history
   * @param authId 
   * @returns 
   */
  async getRecipientListService(payload: ChatHistoryType): Promise<N_GenericResType> {    
    try {  
      const newChat = this.messageRepo.create({
        memberId: Number(payload.memberId),
        senderId: Number(payload.senderId),
        content: payload.content,
        hasPreview: payload.hasPreview,
        previewContent: payload?.previewContent || '',
        replayedBy: payload?.replayedBy || '',
        replayedMsgId: Number(payload?.replayedMsgId)
      });

      await this.messageRepo.save(newChat);

      return;
    } catch (error) {
      this.logger.error(error.toString());
      return;
    }
  }
}
