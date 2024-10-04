export type CheckUserNameType = {
    userName: string;
}

export type RegisterUserType = {
    userName: string;
    firstName: string;
    lastName?: string | null;
    password: string;
}

export type AuthTokenPayloadType = {
    id: string;
    userName: string;
    fullName: string;
}

export type AuthLoginType = {
    userName: string;
    password: string;
}


export type MemberListType = {
    memberId: string;
    roomName: string;
    recipientAuthId: string;
    recipientStatus?: string;
    fullName?: string;
    lastMessage?: string | null;
    newMessage?: boolean;
    clientId?: string;
}

export type ReduceMemberTye = {
    // recipientList : string[],
    memberInfo : MemberListType[]
}