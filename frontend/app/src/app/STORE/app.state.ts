// Global state

import { AvailableUserType, ReciepientListType, SelectedRecipienttoChatType, UserInfoType } from "../common";

export interface TalkTideState {
    isLoggedIn: boolean;
    userState: string | null;
    userInfo: UserInfoType | null;
    selectedRecipient: SelectedRecipienttoChatType | null;
    availableUsersList: AvailableUserType[];
    recipientList: ReciepientListType[];
}