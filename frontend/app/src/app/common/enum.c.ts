export enum LocalStrgNames {
    SELECTED_CHAT = 'selected_chat',
    HISTORY_CHAT = 'history_chat',
    USER_INFO = 'usEr_iNfo',
    USER_STATUS = 'us3r_sTa7Us'
}

export enum ProvideReducerName {
    TALK_TIDE_STORE = 'talk_tide_store'
}

export enum UserStatus {
    BUSY = 'busy',
    AVAILABLE = 'available',
    OFFLINE = 'offline',
    AWAY = 'away'
}

export enum SocketEvtNames {
    REQUEST_LOGGEDINUSERS = 'requestLoggedUsers',
    CHANGE_USER_STATE = 'changeUserState',
    CREATE_MEMBER_BY_AVAILABLE_LIST = 'createMemberByAvailableList',
    GET_RECIPIENT_LIST = 'getRecipientList',
    SOMEONE_LOGGEDIN = 'SOMEONE_LOGGEDIN',
    SOMEONE_LOGGEDOUT = 'SOMEONE_LOGGEDOUT'
}