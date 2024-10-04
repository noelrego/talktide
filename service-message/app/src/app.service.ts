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
   * Function to return Recipient lisy by logged in user
   * @param authId 
   * @returns 
   */
  async getRecipientListService(authId: string): Promise<N_GenericResType> {
    console.log('GET RECEIPEINT LIST: ', authId);

    try {
      
      const chatMembers = [authId];

      const ifExists = await this.memberRepo.find({
        where : {
          chatMembers: Raw (alias => `${alias} && ARRAY[:...chatMembers]::text[]`, { chatMembers })
        },
        select: [ 'id', 'roomName', 'chatMembers']
      });

      if (ifExists) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Found list',
          resData: ifExists
        }
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'No List',
          resData: []
        }
      }

    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Could not fetch list'
      }
    }
  }
}
