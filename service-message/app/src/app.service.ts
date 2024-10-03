import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType } from '@nn-rego/chatapp-common';
import { In, Raw, Repository } from 'typeorm';
import { CreateMemberType } from './common';
import { MessageRepo } from './entity/message.entity';
import { MembersRepo } from './entity/members.entity';

@Injectable()
export class AppService {
  
  private logger = new Logger(AppService.name);

  constructor (
    @InjectRepository(MembersRepo) private memberRepo : Repository<MembersRepo>,
    @InjectRepository(MessageRepo) private messageRepo : Repository<MessageRepo>,
  ) {}


  /**
   * Function to create Chat member
   */
  async createChatMemberService(payload: CreateMemberType) : Promise<N_GenericResType> {
    try {
      console.log('In Servce: ', payload);

      const chatMembers = [payload.firstRecipient.toString(), payload.secondRecipient.toString()];
      const roomName: string = `chat_room_${payload.firstRecipient}_${payload.secondRecipient}`;
      
      console.log(chatMembers, roomName);

      const ifExists = await this.memberRepo.findOne({
        where : {
          chatMembers: Raw (alias => `${alias} && ARRAY[:...chatMembers]::text[]`, { chatMembers })
        }
      })

      console.log(ifExists);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Created Chat history',
        resData: {
          chatMembers, roomName
        }
      }

      const newRecord = this.memberRepo.create({
        chatMembers: chatMembers,
        roomName: roomName
      });
      await this.memberRepo.save(newRecord);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Created Chat history',
        resData: {
          chatMembers, roomName
        }
      }

    } catch (error) {
      console.log(error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }
}
