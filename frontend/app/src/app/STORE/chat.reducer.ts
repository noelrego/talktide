/**
 * Changing application state.
 * Current state to new state
 */

import { createReducer, on } from "@ngrx/store";
import { A_deleteAvailableUser, A_insertAvailableUser, A_insertAvailableUserList, A_insertMembers, A_otherUserChangedState, A_resetAvailableUserList, A_resetuserStatus, A_setUserInfo, A_setUserState, A_updateAvilableUserState, A_userLoggedin } from "./chat.action";
import { TalkTideState } from "./app.state";
import { LocalStrgService } from "../service/localstorage/ls.service";
import { UserStatus } from "../common";

const ls = new LocalStrgService();

export const initialGlobalState : TalkTideState = {
    isLoggedIn : false,
    userState: ls.getUserStatus(),
    userInfo : ls.getUserInfo(),
    selectedRecipient: null,
    availableUsersList: [],
    members: []
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
    )),

    on(A_deleteAvailableUser, (state, { authId }) => (
        {
            ...state,
            availableUsersList: state.availableUsersList.filter(
                user => user.authId !== authId
            )
        }
    )),

    on(A_updateAvilableUserState, (state, { authId, newState }) => (
        {
            ...state,
            availableUsersList: state.availableUsersList.map(
                user => user.authId === authId ? 
                {...user, userStatus: newState}
                : 
                user
            )
        }
    )),

    /* API call to receive the available user list, before adding it to avaiable list
    * Check if they are in Members list
    **/
    on(A_insertAvailableUserList, (state, { availableUsersList }) => {

        const checkAvailableList = availableUsersList.filter(user => 
            !state.members.some(m => m.recipientAuthId === user.authId)
        )
        return {
            ...state,
            availableUsersList: checkAvailableList
        }
    }),

    on(A_insertAvailableUser, (state, { availableUser }) => ({
        ...state,
        availableUsersList: 
            state.availableUsersList.some(
                (user) => {
                    (user.authId === availableUser.authId)
                }
            ) ?
            state.availableUsersList :
            [...state.availableUsersList, {...availableUser, userStatus: 'available'}]
    })),

    on(A_resetAvailableUserList, (state) => ({
        ...state,
        availableUsersList: []
    })),


    on(A_otherUserChangedState, (state, {authId, newState}) => ({
        ...state,
        availableUsersList: state.availableUsersList.map(user =>
            user.authId === authId ? { ...user, userStatus: newState } : user
        )
    })),

    on(A_resetuserStatus, (state) => ({
        ...state,
        userState: UserStatus.AVAILABLE
    })),

    /* To insert all members */
    on(A_insertMembers, (state, { memberList }) => ({
        ...state,
        members: memberList
    }))

)