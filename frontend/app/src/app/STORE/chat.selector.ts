import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TalkTideState } from "./app.state";

export const myState = createFeatureSelector<TalkTideState>('chatapp');

export const S_loggedInstate = createSelector(
    myState,
    (state) => state.isLoggedIn
)

export const S_userInfo = createSelector(
    myState,
    (state) => state.userInfo
)

export const S_userState = createSelector(
    myState,
    (state) => state.userState
)

export const S_availableUserList = createSelector(
    myState,
    (state) => state.availableUsersList
)


export const S_membersList = createSelector(
    myState,
    (state) => state.members
)

export const S_selectedRecipient = createSelector(
    myState,
    (state) => state.selectedRecipient
)