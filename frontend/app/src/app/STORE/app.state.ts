// Global state

import { SelectedRecipienttoChatType, UserInfoType } from "../common";

export interface TalkTideState {
    isLoggedIn: boolean;
    userInfo: UserInfoType | null;
    selectedRecipient: SelectedRecipienttoChatType | null;
}