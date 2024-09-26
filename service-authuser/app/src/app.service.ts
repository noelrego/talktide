import { Injectable } from '@nestjs/common';
import { N_GenericResType } from '@nn-rego/chatapp-common';

@Injectable()
export class AppService {
  
  constructor () {}

  async getAllUserService() : Promise<N_GenericResType> {
    return {
      statusCode: 200,
      message: 'Listing all users',
      resData: []
    }
  }


  async registerUserService(payload: any) : Promise<N_GenericResType> {
    return {
      statusCode: 200,
      message: 'Registered success'
    }
  }


  async loginAuthUserService(payload: any) : Promise<N_GenericResType> {
    return {
      statusCode: 200,
      message: 'Login success'
    }
  }
}
