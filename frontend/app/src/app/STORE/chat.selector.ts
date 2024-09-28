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