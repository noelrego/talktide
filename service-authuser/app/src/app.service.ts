import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType, N_SocketUpdateAction } from '@nn-rego/chatapp-common';
import { AuthUserRepo } from './entity/auth-user.entity';
import { Not, Raw, Repository } from 'typeorm';
import { AuthLoginType, AuthTokenPayloadType, CheckUserNameType, CreateMemberType, MemberListType, ReduceMemberTye, RegisterUserType, SockerUpdateType, SystemStatus, UserStatus } from './common';
import { HelperClass } from './helper/hash.helper';
import { MembersRepo, StatusInfoRepo } from './entity';

@Injectable()
export class AppService {

  private logger = new Logger(AppService.name);

  constructor(
    private helper: HelperClass,
    @InjectRepository(AuthUserRepo) private authUserRepo: Repository<AuthUserRepo>,
    @InjectRepository(StatusInfoRepo) private statusInfoRepo: Repository<StatusInfoRepo>,
    @InjectRepository(MembersRepo) private memberRepo: Repository<MembersRepo>

  ) { }


  /**
   * Function to check the username availablity
   * @param payload 
   * @returns 
   */
  async checkUserNameService(payload: CheckUserNameType): Promise<N_GenericResType> {
    try {

      const user = await this.authUserRepo.findOne({
        where: { userName: payload.userName }
      });

      if (!user) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Username is available'
        }
      } else {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User name not available'
        }
      }

    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }


  /**
   * Function to list all the users in the system
   * @returns N_GenericResType
   */
  async getAllUserService(): Promise<N_GenericResType> {
    try {
      const result = await this.authUserRepo.find({
        select: ['id', 'userName', 'firstName', 'lastName'],
        order: { createAt: 'DESC' }
      });

      if (result.length <= 0) {
        return {
          statusCode: 204,
          message: 'No records'
        }
      }
      return {
        statusCode: 200,
        message: 'Listing all users',
        resData: result
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }

  }


  /**
   * Function to register new user to the system
   * @param payload 
   * @returns 
   */
  async registerUserService(payload: RegisterUserType): Promise<N_GenericResType> {
    try {

      const newUser = this.authUserRepo.create({
        userName: payload.userName,
        firstName: payload.firstName,
        lastName: payload?.lastName,
        userPassword: this.helper.hasData(payload.password)
      });

      await this.authUserRepo.save(newUser);

      const statusInfo = this.statusInfoRepo.create({
        authUser: newUser,
      });

      await this.statusInfoRepo.save(statusInfo);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully'
      }

    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }


  /**
   * Function to Authenticate the user.
   * @param payload AuthLoginType
   * @returns 
   */
  async loginAuthUserService(payload: AuthLoginType): Promise<N_GenericResType> {
    try {

      const user = await this.authUserRepo.findOne({
        where: { userName: payload.userName }
      });

      if (!user) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access'
        }
      }

      //Verify the password
      if (this.helper.verifyHash(payload.password, user.userPassword)) {

        //User is valid Generate JWT token
        const jwtPayload: AuthTokenPayloadType = {
          id: user.id.toString(),
          userName: user.userName,
          fullName: `${user.firstName}${(user?.lastName) ? ' ' + user.lastName : ''}`
        };
        const accessToken = await this.helper.generateAuthToken(jwtPayload);

        const userInfo = {
          authId: user.id.toString(),
          username: user.userName,
          fullName: `${user.firstName}${(user?.lastName) ? ' ' + user.lastName : ''}`
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Authenticated Successfully',
          resData: {
            accessToken,
            userInfo
          }
        }

      } else {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access'
        }
      }

    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }



  /**
   * Function to  update status of user
   * @param payload 
   */
  async updateSocketStatusToUserService(payload: { action: N_SocketUpdateAction, data: SockerUpdateType }) : Promise<boolean> {
    try {
      const statusInfo = await this.statusInfoRepo.findOne({
        where: {
          authUser: { id: Number(payload.data.authId) }
        }
      });

      if (!statusInfo) return;

      switch (payload.action) {
        case N_SocketUpdateAction.CONNECTED:
          statusInfo.userStatus = UserStatus.AVAILABLE;
          statusInfo.systemStatus = SystemStatus.LOGIN;
          statusInfo.clientId = payload.data.clientId;
          this.statusInfoRepo.save(statusInfo);
          break;

        case N_SocketUpdateAction.DISCONNECTED:
          statusInfo.userStatus = UserStatus.OFFLINE;
          statusInfo.systemStatus = SystemStatus.LOGOUT;
          statusInfo.clientId = '';
          this.statusInfoRepo.save(statusInfo);
          break;

        case N_SocketUpdateAction.STATUS_UPDATE:
          statusInfo.systemStatus = SystemStatus.LOGIN;
          if (payload.data.newStatus === UserStatus.AVAILABLE) {
            statusInfo.userStatus = UserStatus.AVAILABLE;
          } else if (payload.data.newStatus === UserStatus.AWAY) {
            statusInfo.userStatus = UserStatus.AWAY;
          } else if (payload.data.newStatus === UserStatus.BUSY) {
            statusInfo.userStatus = UserStatus.BUSY;
          } else {
            statusInfo.userStatus = UserStatus.OFFLINE;
          }
          this.statusInfoRepo.save(statusInfo);

          break;
      }
      return true;
    } catch (error) {
      console.log('err: ', error.toString());
      return false;
    }
  }



  /**
   * Function to get list of available users
   * @param payload authId
   */
  async getAvailableUserListService(authId: string): Promise<N_GenericResType> {
    try {
      console.log('AVAILABLE LIST: ', authId);
      const users = await this.authUserRepo
        .createQueryBuilder('auth_user')
        .leftJoinAndSelect('auth_user.statusInfo', 'statusInfo')
        .where('auth_user.id != :authId', { authId })
        .andWhere('statusInfo.system_status = :systemStatus', { systemStatus: SystemStatus.LOGIN })
        .getMany();

      const list = users.map(user => ({
        authId: user.id.toString(),
        userName: user.userName,
        fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
        userStatus: user.statusInfo.userStatus,
        clientId: user.statusInfo.clientId
      }));

      return {
        statusCode: HttpStatus.OK,
        message: 'Available user list',
        resData: list
      }

    } catch (error) {
      console.error(error.toString());
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: error.toString()
      }
    }
  }



  /**
   * Function to create Chat member, Before creating checking with 'array overlap'
   * to make sure no two users create same chat memeber. Once a user creates then we can use that in Participient list,
   * Postgres array containement
   */
  async createChatMemberService(payload: CreateMemberType): Promise<N_GenericResType> {
    try {
      console.log('In Servce: ', payload);

      const chatMembers = [payload.firstMember.toString(), payload.secondMember.toString()];
      const roomName: string = `chat_room_${payload.firstMember}_${payload.secondMember}`;

      console.log(chatMembers, roomName);

      // Array
      const ifExists = await this.memberRepo.findOne({
        where: {
          chatMembers: Raw(alias => `ARRAY[:...chatMembers] <@ ${alias}`, { chatMembers })
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


  /**
   * Function to return Recipient lisy by logged in user
   * @param authId 
   * @returns 
   */
  async getMemberListService(authId: string): Promise<N_GenericResType> {

    try {

      const chatMembers = [authId];

      const memberExist = await this.memberRepo.find({
        where: {
          chatMembers: Raw(alias => `${alias} && ARRAY[:...chatMembers]::text[]`, { chatMembers })
        },
        select: ['id', 'roomName', 'chatMembers']
      });

      if (!memberExist) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'No List',
          resData: []
        }
      }

      console.log(' REQUESTER : ', authId);

      const tofetchMemberInfo = await memberExist.reduce<Promise<ReduceMemberTye>>(async (acc, item) => {
        const onlyrecipient = item.chatMembers.filter(ids => ids !== authId).join(',')
        // const memberInfo = await this.authUserRepo.find
        const accpromise = await acc;

        const memebrInfo = await this.authUserRepo
        .createQueryBuilder('auth_user')
        .leftJoinAndSelect('auth_user.statusInfo', 'statusInfo')
        .where('auth_user.id = :onlyrecipient', { onlyrecipient })
        .getOne();

        console.log('MEMBER INFO INSIDE REDUCE: ', memebrInfo);

        accpromise.memberInfo.push({
          memberId: item.id.toString(), 
          roomName: item.roomName,
          recipientAuthId: onlyrecipient,
          recipientStatus: memebrInfo.statusInfo.userStatus,
          fullName: `${memebrInfo.firstName} ${memebrInfo.lastName || ''}`.trim(),
          lastMessage: 'Click to star the conversation . . .',
          newMessage: false,
          clientId: memebrInfo.statusInfo?.clientId || ''
        });
        return acc;
      }, Promise.resolve({memberInfo: []}));

      console.log('Transform memebr info', tofetchMemberInfo);


      return {
        statusCode: HttpStatus.OK,
        message: 'member List',
        resData: tofetchMemberInfo
      }

    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Could not fetch list'
      }
    }
  }



  /**
   * Function to return member info
   * @param authId string
   */
  async getMemberInfoService(authId: string) : Promise<object> {
    try {
      
      const memebrInfo = await this.authUserRepo
      .createQueryBuilder('auth_user')
      .leftJoinAndSelect('auth_user.statusInfo', 'statusInfo')
      .where('auth_user.id = :authId', {authId})
      .getOne();

      if (!memebrInfo) return {};

      const memberInfoData : MemberListType = {
        memberId: memebrInfo.statusInfo.id.toString(),
        roomName: '',
        recipientAuthId: memebrInfo.id.toString(),
        recipientStatus: memebrInfo.statusInfo.userStatus,
        fullName: `${memebrInfo.firstName} ${memebrInfo?.lastName || ''}`.trim(),
        lastMessage: 'Click here to start the conversation ...',
        newMessage: false,
        clientId: memebrInfo.statusInfo.clientId
      }

      return memberInfoData;

    } catch (error) {
      console.log(error.toString());
      return {};
    }
  }

}
