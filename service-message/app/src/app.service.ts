import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { N_GenericResType } from '@nn-rego/chatapp-common';
import { AuthUserRepo } from './entity/auth-user.entity';
import { Repository } from 'typeorm';
import { AuthLoginType, AuthTokenPayloadType, CheckUserNameType, RegisterUserType } from './common';
import { HelperClass } from './helper/hash.helper';

@Injectable()
export class AppService {
  
  private logger = new Logger(AppService.name);

  constructor (
    private helper : HelperClass,
    @InjectRepository(AuthUserRepo) private authUserRepo : Repository<AuthUserRepo>
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
      console.log('OKOOKOKOKO')
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
          userName: user.userName
        };

        const accessToken = await this.helper.generateAuthToken(jwtPayload);
        const userInfo = {
          authId: user.id,
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
}
