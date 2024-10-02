import { createAction, props } from "@ngrx/store";
import { UserInfoType, AvailableUserType } from "../common";


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


export const A_deleteAvailableUser = createAction('[Recipient] To remove as he loggs out', 
    props<{ authId: number }>()
)

export const A_updateAvilableUserState = createAction('[Recipient] To update user status as he chnages the state', 
    props<{ authId: number, newState: string }>()
)