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
    
    // emit
    CHANGE_USER_STATE = 'changeUserState',
    CREATE_MEMBER_BY_AVAILABLE_LIST = 'createMemberByAvailableList',
    CHAT_SENT = 'chatSent',

    // on
    SOMEONE_LOGGEDIN = 'SOMEONE_LOGGEDIN',
    SOMEONE_LOGGEDOUT = 'SOMEONE_LOGGEDOUT',
    CREATED_CHAT_MEMBER = 'CREATED_CHAT_MEMBER',
    CREATED_CHAT_MEMBER_SELF = 'CREATED_CHAT_MEMBER_SELF',
    USER_CHANGED_STATUS = 'USER_CHANGED_STATUS',
    CHAT_NOTIFY = 'CHAT_NOTIFY'
}