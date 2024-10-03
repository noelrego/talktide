import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { N_GenericResType, N_MsgPatternmessageService } from "@nn-rego/chatapp-common";
import { audit, firstValueFrom } from "rxjs";
import { CreateMemberType, MicroServiceName, RecipientType } from "src/common";

@Injectable()
export class ChatGatewayService {

    constructor (
        @Inject(MicroServiceName.MESSAGE_SERVICE) private messageClient: ClientProxy
    ) { }


    /**
     * Function to create Members on clikc on Available list
     * @param members 
     */
    async createChatMembersService(members: CreateMemberType) {
        console.log(' IN SERVER: ', members);
        this.messageClient.emit(N_MsgPatternmessageService.CREATE_CHAT_MEMBER, members).subscribe()
    }


    /**
     * Function to get the list of participient by Logged in user authId
     */
    async getRecipientListService(authId: string) {
        const result : N_GenericResType = await firstValueFrom(
            this.messageClient.send(N_MsgPatternmessageService.GET_CHAT_MEMBERS_LIST, authId)
        )

        return result;
    }

}