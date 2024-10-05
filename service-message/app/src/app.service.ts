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
  async createChatHistoryService(payload: ChatHistoryType): Promise<N_GenericResType> {    
    try {  
      const newChat = this.messageRepo.create({
        memberId: Number(payload.memberId),
        senderId: Number(payload.senderId),
        content: payload.content,
        hasPreview: payload.hasPreview,
        previewContent: payload?.previewContent || '',
        replayedBy: payload?.replayedBy || '',
        replayedMsgId: 0
      });

      await this.messageRepo.save(newChat);

      return;
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }



   /**
   * Function to create chat history
   * @param authId 
   * @returns 
   */
   async getChatHistoryListService(payload: number): Promise<N_GenericResType> {    
    try {  
      const result = await this.messageRepo.find({
        where: {memberId: payload},
        take: 10,
        order: {
          createAt: 'DESC'
        }
      });

      if (result.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Message List',
          resData: result
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Ni Messages',
        }
      }

      return;
    } catch (error) {
      this.logger.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }
}
