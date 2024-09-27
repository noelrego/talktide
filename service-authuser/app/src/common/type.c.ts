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
}

export type AuthLoginType = {
    userName: string;
    password: string;
}