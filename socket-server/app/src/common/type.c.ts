export type ClientJwtData = {
    authId: string;
    userName: string;
    fullName: string;
}

export type ClientUserData =  ClientJwtData & {
    userStatus: string;
}

export type CreateMemberType = {
    firstMember: string;
    secondMember: string;
    clientId?: string;
}


export type RecipientType = {
    authId: string,
    userStatus: string;
    roomname: string;
    newMessage: boolean;
    msgPreview: string;
}

export type SockerUpdateType = {
    clientId: string;
    authId: string;
    newStatus?: string;
}


export type ChatHistoryType = {
    msgId: string;
    memberId: string;
    senderId: string;
    content: string;
    hasPreview: boolean;
    previewContent?: string;
    replayedBy?: string;
    replayedMsgId?: string;
    msgTime: string;
    clientId?: string;
}