import { createAction, props } from "@ngrx/store";
import { UserInfoType, AvailableUserType, MemberListType, SelectedRecipientChatType, ChatHistoryType } from "../common";


export const A_userLoggedin = createAction('[Auth] User Logged in status', 
    props<{isLoggedIn: boolean}>()
);


export const A_setUserInfo = createAction('[Auth] to set the logged in user', 
    props<{ userInfo: UserInfoType }>()
)

export const A_setUserState = createAction('[User] to set user state', 
    props<{ userState: string }>()
)

export const A_insertAvailableUserList = createAction('[Recipient] Recipient avilable list', 
    props<{ availableUsersList: AvailableUserType[] }>()
)

export const A_insertAvailableUser = createAction('[Recipient] Insert one logged in user', 
    props<{ availableUser: AvailableUserType }>()
)

export const A_resetAvailableUserList = createAction('[Recipient] To reset list on logout')

export const A_resetuserStatus = createAction('[User] to reset user state once he logs out or close the browser.')

export const A_particularUserLoggedout = createAction('[LOGOUT] To remove / offline the user who Loggedout', 
    props<{ authId: string }>()
)

export const A_updateAvilableUserState = createAction('[Recipient] To update user status as he chnages the state', 
    props<{ authId: string, newState: string }>()
)

export const A_otherUserChangedState = createAction('[State Chnage] Other online user chnaged the status', 
    props<{ authId: string, newState: string }>()
)

export const A_insertMembers = createAction('[Members] The insert all members', 
    props<{ memberList: MemberListType[] }>()
)

export const A_updateRemoteUserStatus = createAction('[Update Status] To update the status in recipient list', 
    props<{ authId: string, newStatus: string }>()
)

export const A_setSelectedRecipient = createAction('[SELECTED] Selected recipient', 
    props<{ selectedRecipient: SelectedRecipientChatType }>()
)

export const A_updateChatHistory = createAction('[CHAT HISTORY] On new recipient select update messages',
    props<{ chatContents: ChatHistoryType[] }>()
)

export const A_pushNewChatContent = createAction('[CHAT HISTORY] On user creates new message', 
    props<{ chatContent: ChatHistoryType }>()
)

export const A_chatNotify = createAction('[CHAT HISTORY] Notification received', 
    props<{ chatContent: ChatHistoryType }>()
)

export const A_resetChatHistory = createAction('[CHAT HISTORY] Reset chat history')

export const A_resetGlobalState = createAction('[RESET] Reset global state');