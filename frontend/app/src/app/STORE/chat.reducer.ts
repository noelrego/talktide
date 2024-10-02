/**
 * Changing application state.
 * Current state to new state
 */

import { createReducer, on } from "@ngrx/store";
import { A_setUserInfo, A_setUserState, A_userLoggedin } from "./chat.action";
import { TalkTideState } from "./app.state";
import { LocalStrgService } from "../service/localstorage/ls.service";

const ls = new LocalStrgService();

export const initialGlobalState : TalkTideState = {
    isLoggedIn : false,
    userState: ls.getUserStatus(),
    userInfo : ls.getUserInfo(),
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