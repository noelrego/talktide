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
}

export type ReciepientListType = {
    memberId: string;
    roomName: string;
    recipientAuthId: string;
    recipientStatus: string;
    fullName: string;
    lastMessage: string | null;
    newMessage: boolean;
}