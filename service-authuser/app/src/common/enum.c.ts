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
  authId: string;
  newStatus?: string;
}
