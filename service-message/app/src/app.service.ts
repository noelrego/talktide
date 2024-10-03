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
   * Function to create Chat member, Before creating checking with 'array overlap'
   * to make sure no two users create same chat memeber. Once a user creates then we can use that in Participient list
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

      if (!ifExists) {
        const newRecord = this.memberRepo.create({
          chatMembers: chatMembers,
          roomName: roomName
        });
        const savedData = await this.memberRepo.save(newRecord);

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Created Chat history',
          resData: savedData
        }

      } else {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Already have a chat room',
          resData: ifExists
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



  async getRecipientListService(authId: string): Promise<N_GenericResType> {
    console.log('GET RECEIPEINT LIST: ', authId);

    try {
      
      const chatMembers = [authId];

      const ifExists = await this.memberRepo.find({
        where : {
          chatMembers: Raw (alias => `${alias} && ARRAY[:...chatMembers]::text[]`, { chatMembers })
        }
      });

      console.log(ifExists);
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Available List',
        resData: {authId}
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Could not fetch list'
      }
    }
  }
}
