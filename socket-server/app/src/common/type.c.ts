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
