import { createAction, props } from "@ngrx/store";
import { UserInfoType } from "../common";

export const A_userLoggedin = createAction('[Auth] User Logged in status', 
    props<{isLoggedIn: boolean}>()
);


export const A_setUserInfo = createAction('[Auth] to set the logged in user', 
    props<{ userInfo: UserInfoType }>()
)

export const A_setUserState = createAction('[User] to set user state', 
    props<{userState: string}>()
)