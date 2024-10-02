export type ClientJwtData = {
    authId: number;
    userName: string;
    fullName: string;
}

export type ClientUserData =  ClientJwtData & {
    userStatus: string;
}