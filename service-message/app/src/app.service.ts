import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType } from '@nn-rego/chatapp-common';
import { Repository } from 'typeorm';
import { AuthLoginType, AuthTokenPayloadType, CheckUserNameType, RegisterUserType } from './common';
import { HelperClass } from './helper/hash.helper';
import { MessageRepo } from './entity/message.entity';
import { MembersRepo } from './entity/members.entity';

@Injectable()
export class AppService {
  
  private logger = new Logger(AppService.name);

  constructor (
    @InjectRepository(MembersRepo) private memberRepo : Repository<MembersRepo>,
    @InjectRepository(MessageRepo) private messageRepo : Repository<MessageRepo>,
  ) {}

}
