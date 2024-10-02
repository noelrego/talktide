export type ClientJwtData = {
    authId: string;
    userName: string;
    fullName: string;
}

export type ClientUserData =  ClientJwtData & {
    userStatus: string;
}