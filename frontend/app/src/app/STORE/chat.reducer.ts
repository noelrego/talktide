/**
 * Changing application state.
 * Current state to new state
 */

import { createReducer, on } from "@ngrx/store";
import { A_particularUserLoggedout, A_insertAvailableUser, A_insertAvailableUserList, A_insertMembers, A_otherUserChangedState, A_resetAvailableUserList, A_resetuserStatus, A_setUserInfo, A_setUserState, A_updateAvilableUserState, A_userLoggedin, A_updateRemoteUserStatus, A_setSelectedRecipient, A_updateChatHistory, A_pushNewChatContent, A_resetGlobalState, A_resetChatHistory, A_chatNotify } from "./chat.action";
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
    members: [],
    chatMessages: []
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

    on(A_particularUserLoggedout, (state, { authId }) => (
        {
            ...state,
            availableUsersList: state.availableUsersList.filter(
                user => user.authId !== authId
            ),
            members: state.members.map(item =>
                item.recipientAuthId === authId ?
                {...item, recipientStatus: 'offline', lastMessage: 'User logged out', newMessage: false}
                :
                item
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

        const checkMemberList = availableUsersList.filter(user => 
            !state.members.some(m => m.recipientAuthId === user.authId)
        )
        return {
            ...state,
            availableUsersList: checkMemberList
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
    on(A_insertMembers, (state, { memberList }) => {

        // In case of Selected member update clinetId
        const hasInSelectedRecipient = state.selectedRecipient ?
            memberList.find(member => member.recipientAuthId === state.selectedRecipient?.recipientAuthId) : null
        return {
            ...state,
            members: memberList,
            selectedRecipient: hasInSelectedRecipient ?
                {...state.selectedRecipient, clientId: hasInSelectedRecipient.clientId } 
                :
                state.selectedRecipient
        }
    }),

    /* To update remote user status in Recipient list */
    on(A_updateRemoteUserStatus, (state, {authId, newStatus}) => {
        const isMemberList = state.members.map(user =>
            user.recipientAuthId === authId ?
            {...user, recipientStatus: newStatus} : user
        )

        const isAvailableList = state.availableUsersList.map(u => 
            u.authId === authId ? {...u, userStatus: newStatus } : u
        );
        return {
            ...state,
            members: isMemberList,
            availableUsersList: isAvailableList
        }
    }),


    // To set the selected Recipient
    on(A_setSelectedRecipient, (state, {selectedRecipient}) => {
        
        const removeNewMsg = state.members.map(usr => 
            (usr.recipientAuthId === selectedRecipient.recipientAuthId) ? 
            {...usr, newMessage: false } : usr
            
        )
        return {
            ...state,
            selectedRecipient: selectedRecipient,
            members: removeNewMsg
        }
    }),

    // To upadte chat as new recipient is selected
    on(A_updateChatHistory, (state, { chatContents }) => (
        {
            ...state,
            chatMessages: chatContents
        }
    )),

    on(A_pushNewChatContent, (state, { chatContent }) => (
        {
            ...state,
            chatMessages: [chatContent, ...state.chatMessages]
        }
    )),

    on(A_chatNotify, (state, { chatContent }) => {
        
        // Check sender id is in selected 
        const msgContent = (state.selectedRecipient?.recipientAuthId === chatContent.senderId) ?
            [chatContent, ...state.chatMessages] : state.chatMessages
        
        // Is sender is not selcted then notify 
        const tempMembers = state.members.map(usr =>
            (usr.recipientAuthId !== state.selectedRecipient?.recipientAuthId
                && usr.recipientAuthId === chatContent.senderId
            ) ? 
            {...usr, newMessage: true } : usr
        )

        return {
            ...state,
            chatMessages: msgContent,
            members: tempMembers
        }
    }),

    on(A_resetChatHistory, ( state ) => ({
        ...state,
        chatMessages: []
    })),

    on(A_resetGlobalState, () => initialGlobalState)

)