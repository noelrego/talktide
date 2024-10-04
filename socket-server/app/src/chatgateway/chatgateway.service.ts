import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { N_GenericResType, N_MsgPatternAuthUserService, N_MsgPatternMessageService, N_SocketUpdateAction } from "@nn-rego/chatapp-common";
import { audit, firstValueFrom } from "rxjs";
import { CreateMemberType, MicroServiceName, RecipientType, SockerUpdateType } from "src/common";

@Injectable()
export class ChatGatewayService {

    constructor (
        @Inject(MicroServiceName.AUTH_SERVICE) private authServiceClient: ClientProxy,
        @Inject(MicroServiceName.MESSAGE_SERVICE) private messageClient: ClientProxy
    ) { }


    /**
     * Function to create Members on clikc on Available list
     * @param members 
     */
    async createChatMembersService(members: CreateMemberType) {
        console.log(' CREATE MEMEBR : ', members);
        // this.messageClient.emit(N_MsgPatternMessageService.CREATE_CHAT_MEMBER, members).subscribe()
    }


    /**
     * Function to get the list of participient by Logged in user authId
     */
    async getRecipientListService(authId: string) {
        const result : N_GenericResType = await firstValueFrom(
            this.authServiceClient.send(N_MsgPatternMessageService.GET_CHAT_MEMBERS_LIST, authId)
        )
        return result;
    }


    /**
     * Function to update the user status in db 
     * for chnaging status [busy, offline, available, away]
     * for socket connect & disconnect [login, logout]
     */
    async socketUpadteUserStatus(action: N_SocketUpdateAction, data: SockerUpdateType) {
        this.authServiceClient.emit(N_MsgPatternAuthUserService.SOCKET_UPDATE_USER_STATUS, {action, data}).subscribe();
    }




    /**
     * When user login in first time to request for Available users in the system
     * @param clientAuthId 
     * @returns 
     */
    async requestAvailableUsers(clientAuthId: string) {
        const list = await firstValueFrom(
            this.authServiceClient.send(N_MsgPatternAuthUserService.GET_AVAILABLE_LIST, clientAuthId)
        );  
        console.log(list);
        return list;

    }

}