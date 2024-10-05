export type UserInfoType = {
    authId: string;
    userName: string;
    fullName: string;
}

export type SelectedRecipientChatType = {
    recipientAuthId?: string;
    recipientFullName?: string;
    clientId?: string;
    memberId?: string;
}

export type AvailableUserType = {
    authId: string;
    userName: string;
    fullName: string;
    userStatus: string;
    clientId: string;
}

export type MemberListType = {
    memberId: string;
    roomName: string;
    recipientAuthId: string;
    recipientStatus: string;
    fullName: string;
    lastMessage: string | null;
    newMessage: boolean;
    clientId: string;
}


export type CreateMemberType = {
    firstMember: string;
    secondMember: string;
    clientId?: string;
}

export type LoggedInMemberInfo = {
    authId: string;
    userName: string;
    fullName: string;
    userStatus: string;
    clientId: string;
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