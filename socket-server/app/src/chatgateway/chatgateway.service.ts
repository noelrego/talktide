import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { N_GenericResType, N_MsgPatternAuthUserService, N_MsgPatternMessageService, N_SocketUpdateAction } from "@nn-rego/chatapp-common";
import { audit, firstValueFrom } from "rxjs";
import { ChatHistoryType, CreateMemberType, MicroServiceName, RecipientType, SockerUpdateType } from "src/common";

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
    async createChatMembersService(members: CreateMemberType) : Promise<N_GenericResType> {
        console.log(' CREATE MEMEBR : ', members);
        const response : N_GenericResType = await firstValueFrom(
            this.authServiceClient.send(N_MsgPatternAuthUserService.CREATE_MEMBER, members)
        )
        return response;
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
    async socketUpadteUserStatus(action: N_SocketUpdateAction, data: SockerUpdateType): Promise<boolean> {
        const update = await firstValueFrom(
            this.authServiceClient.send(N_MsgPatternAuthUserService.SOCKET_UPDATE_USER_STATUS, {action, data})
        );
        return update;
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



    /**
     * To fetch indivisual user info as he logs in
     * @param clientAuthId 
     * @returns 
     */
    async getMemberInfo(authId: string) {
        const info = await firstValueFrom(
            this.authServiceClient.send(N_MsgPatternAuthUserService.GET_MEMBER_INFO, authId)
        ); 
        return info;

    }


    /**
     * To fetch create chat History
     * @param clientAuthId 
     * @returns 
     */
    async createChatHistory(chatInfo: ChatHistoryType) {
        return this.messageClient.send(N_MsgPatternMessageService.CREATE_MESSAGE, chatInfo).subscribe(); 
    }

}