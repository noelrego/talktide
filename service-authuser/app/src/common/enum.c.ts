export enum TableNames {
  AUTH_USER = 'auth_user'
}

export enum UserStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  AWAY = 'away',
  OFFLINE = 'offline',
}

export enum SystemStatus {
  LOGIN = 'login',
  LOGOUT = 'logout',
}


export type SockerUpdateType = {
  clientId: string;
  authId: string;
  newStatus?: string;
}


export type CreateMemberType = {
  firstMember: string;
  secondMember: string;
  clientId?: string;
}