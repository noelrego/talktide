export type CreateMemberType = {
    firstRecipient: string;
    secondRecipient: string;
}

export type ChatHistoryType = {
    msgId: string;
    memberId: string;
    senderId: string;
    content: string;
    hasPreview: boolean;
    previewContent?: string;
    replayedBy?: string;
    replayedMsgId?: string;
    msgTime: string;
}