export type UserInfoType = {
    authId: number | null;
    userName: string;
    fullName: string;
}

export type SelectedRecipienttoChatType = {
    recipientId: number | null,
    recipientUserName: string;
    recipientFullName: string;
}

export type AvailableUserType = {
    authId: number;
    userName: string;
    fullName: string;
    userStatus: string;
}