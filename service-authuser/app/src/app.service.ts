import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType, N_SocketUpdateAction } from '@nn-rego/chatapp-common';
import { AuthUserRepo } from './entity/auth-user.entity';
import { Not, Repository } from 'typeorm';
import { AuthLoginType, AuthTokenPayloadType, CheckUserNameType, RegisterUserType, SockerUpdateType, SystemStatus, UserStatus } from './common';
import { HelperClass } from './helper/hash.helper';
import { StatusInfoRepo } from './entity';

@Injectable()
export class AppService {
  
  private logger = new Logger(AppService.name);

  constructor (
    private helper : HelperClass,
    @InjectRepository(AuthUserRepo) private authUserRepo : Repository<AuthUserRepo>,
    @InjectRepository(StatusInfoRepo) private statusInfoRepo : Repository<StatusInfoRepo>

  ) {}


  /**
   * Function to check the username availablity
   * @param payload 
   * @returns 
   */
  async checkUserNameService(payload: CheckUserNameType) : Promise<N_GenericResType> {
    try {
      
      const user = await this.authUserRepo.findOne({
        where: {userName: payload.userName}
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
  async getAllUserService() : Promise<N_GenericResType> {
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
  async registerUserService(payload: RegisterUserType) : Promise<N_GenericResType> {
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
  async loginAuthUserService(payload: AuthLoginType) : Promise<N_GenericResType> {
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
          fullName: `${user.firstName}${(user?.lastName)? ' ' +user.lastName : ''}`
        };
        const accessToken = await this.helper.generateAuthToken(jwtPayload);

        const userInfo = {
          authId: user.id.toString(),
          username: user.userName,
          fullName: `${user.firstName}${(user?.lastName)? ' ' +user.lastName : ''}`
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
  async updateSocketStatusToUserService(payload: {action: N_SocketUpdateAction, data: SockerUpdateType}) {
    try {
      
      const statusInfo = await this.statusInfoRepo.findOne({
        where: {
          authUser: { id: Number(payload.data.authId) }
        }
      });

      if (!statusInfo) return;

      switch(payload.action) {
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
      

      return;
    } catch (error) {
      console.log('err: ', error.toString());
      return;
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
        id: user.id.toString(),
        userName: user.userName,
        fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
        userStatus: user.statusInfo.userStatus,
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

}
