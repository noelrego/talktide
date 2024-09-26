import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto';

@Injectable()
export class AuthuserService {

    constructor () {}


    /**
     * Function to return all the users in the system.
     */
    getAllUserService() {
        return [
            {
                id: 1,
                userName: 'nnr',
                firstName: 'Noel',
                lastName: 'Rego'
            }
        ]
    }


    /**
     * Function to register user to the application
     */
    registerUserService(dto: RegisterUserDto) {
        return dto;
    }
}
