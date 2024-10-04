export type UserInfoType = {
    authId: string;
    userName: string;
    fullName: string;
}

export type SelectedRecipienttoChatType = {
    recipientId: number | null,
    recipientUserName: string;
    recipientFullName: string;
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
