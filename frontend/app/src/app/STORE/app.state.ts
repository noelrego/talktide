// Global state

import { AvailableUserType, ChatHistoryType, MemberListType, SelectedRecipientChatType, UserInfoType } from "../common";

export interface TalkTideState {
    isLoggedIn: boolean;
    userState: string | null;
    userInfo: UserInfoType | null;
    selectedRecipient: SelectedRecipientChatType | null;
    availableUsersList: AvailableUserType[];
    members: MemberListType[];
    chatMessages: ChatHistoryType[];
}