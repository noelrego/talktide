/**
 * Changing application state.
 * Current state to new state
 */

import { createReducer, on } from "@ngrx/store";
import { A_setUserInfo, A_setUserState, A_userLoggedin } from "./chat.action";
import { TalkTideState } from "./app.state";
import { LocalStrgService } from "../service/ls/ls.service";
import { UserStatus } from "../common";

const hasUserInfo = () => {
    const ls = new LocalStrgService();
    const tempData = ls.getUserInfo();
    return tempData;
}

export const initialGlobalState : TalkTideState = {
    isLoggedIn : false,
    userState: UserStatus.AWAY,
    userInfo : hasUserInfo(),
    selectedRecipient: null
}; // Inital State

export const R_setUserLoggedin = createReducer(
    initialGlobalState,

    on(A_userLoggedin, (state, {isLoggedIn}) => {
        console.log(' U P D T I N G  . . . . . S T A T E: ', state.isLoggedIn, isLoggedIn);
        return {
            ...state, // Keep the existing state
            isLoggedIn: isLoggedIn, // Update isLoggedIn
          };
    }),

    on(A_setUserInfo, (state, {userInfo}) => (
        {
            ...state,
            userInfo: userInfo
        }
    )),

    on(A_setUserState, (state, { userState }) => (
        {
            ...state,
            userState: userState
        }
    ))

)