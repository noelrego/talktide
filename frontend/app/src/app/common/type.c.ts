export type UserInfoType = {
    authId: string | null;
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