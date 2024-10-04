import { Inject, Injectable, Logger } from '@nestjs/common';
import { CheckUserNameDto, LoginUserDto, RegisterUserDto } from 'src/dto';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { N_MsgPatternAuthUserService, N_GenericResType } from '@nn-rego/chatapp-common';
import { MicroServiceName } from 'src/common';

@Injectable()
export class AuthuserService {

    private readonly logger = new Logger(AuthuserService.name);
    constructor (
        @Inject(MicroServiceName.AUTH_SERVICE) private authUserClient: ClientProxy
    ) {}

    /**
     * Function to Check the user name availablity
     */
    async checkUserNameService(dto: CheckUserNameDto) : Promise<N_GenericResType> {

        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.CHECK_USERNAME, dto)
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


    /**
     * Function to return all the users in the system.
     */
    async getAllUserService() : Promise<N_GenericResType> {

        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.GET_ALL_USERS, 'none')
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


    /**
     * Function to register user to the application
     */
    async registerUserService(dto: RegisterUserDto) : Promise<N_GenericResType> {
        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.REGISTER_USER, dto)
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


    /**
     * Function to authenticate login user.
     */
    async loginAuthUserService(dto: LoginUserDto) : Promise<N_GenericResType> {
        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.LOGIN_USER, dto)
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


    /**
     * Function get Available user list
     */
    async getAvailableList(authId: string) : Promise<N_GenericResType> {
        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.GET_AVAILABLE_LIST, authId)
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


    /**
     * Function get Available member list
     */
    async getMemberListService(authId: string) : Promise<N_GenericResType> {
        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(N_MsgPatternAuthUserService.GET_MEMBER, authId)
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
