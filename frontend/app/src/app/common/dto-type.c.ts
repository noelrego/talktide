// All DTO are deinfed in types

export type CheckUserDto = {
    userName: string;
}

export type RegisterUserDto = {
    userName: string;
    firstName: string;
    lastName?: string;
    password: string;
}

export type LoginUserDto = {
    userName: string;
    password: string;
}