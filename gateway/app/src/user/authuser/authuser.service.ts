import { Inject, Injectable, Logger } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from 'src/dto';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MsgPatternAuthUserService, N_GenericResType } from '@nn-rego/chatapp-common';
import { MicroServiceName } from 'src/common';

@Injectable()
export class AuthuserService {

    private readonly logger = new Logger(AuthuserService.name);
    constructor (
        @Inject(MicroServiceName.AUTH_SERVICE) private authUserClient: ClientProxy
    ) {}


    /**
     * Function to return all the users in the system.
     */
    async getAllUserService() : Promise<N_GenericResType> {

        const response : N_GenericResType = await firstValueFrom(
            this.authUserClient.send(MsgPatternAuthUserService.GET_ALL_USERS, 'data')
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
            this.authUserClient.send(MsgPatternAuthUserService.REGISTER_USER, dto)
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
            this.authUserClient.send(MsgPatternAuthUserService.LOGIN_USER, dto)
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
