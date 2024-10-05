import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChatHistoryType, SelectedRecipientChatType, SocketEvtNames, UserInfoType } from '../../common';
import { A_pushNewChatContent, S_chatHistoryList, S_selectedRecipient, S_userInfo } from '../../STORE';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('chatBoxArea') private chatboxlistarea : ElementRef;

  tempMsgId: number = 0;    // for scolling effect on local chats.
  newMessage: string = '';

  showPreviewMessage: boolean = false;
  replayingToPreviewMsg: string = '';
  previewMsgId: string = '';

  loggedInUser$: Observable<UserInfoType | null>;
  loggedInUser : UserInfoType | null;

  selectedRecipient$ : Observable<SelectedRecipientChatType | null>;
  selectedRecipient: SelectedRecipientChatType;

  chatHistoryList$: Observable<ChatHistoryType[]>;

  // Form control
  inputTextBox = new FormControl('', [Validators.required]);
  inputTextInValid : boolean = false;

  constructor(
    private socketService: SocketService,
    private store: Store,
  ) {
    this.loggedInUser$ = this.store.select(S_userInfo);
    this.selectedRecipient$ = this.store.select(S_selectedRecipient);
    this.chatHistoryList$ = this.store.select(S_chatHistoryList);
  }

  ngOnInit(): void {
    this.loggedInUser$.subscribe(res => this.loggedInUser = res);
    this.selectedRecipient$.subscribe(res => this.selectedRecipient = (res)? res: {});

    this.inputTextBox.valueChanges.subscribe((res) => {
        this.inputTextInValid = false;
      }
    )}

  ngAfterContentInit(): void {
    
  }

  sendMessage() {
    if (!this.inputTextBox.valid) {
      this.inputTextInValid = true
      return;
    }
    
    const tempChat : ChatHistoryType = {
      msgId: `tempmsg_id${this.tempMsgId++}`,
      memberId: this.selectedRecipient.memberId || '',
      content: this.inputTextBox.value?.trim() || '',
      hasPreview: this.showPreviewMessage,
      replayedBy: this.loggedInUser?.fullName,
      previewContent: this.replayingToPreviewMsg || '',
      senderId: this.loggedInUser?.authId || '',
      msgTime: this.getFormattedTime(),
      replayedMsgId: this.previewMsgId,
      clientId: this.selectedRecipient?.clientId || ''
    };

    this.store.dispatch(A_pushNewChatContent({
      chatContent: tempChat
    }));

    this.socketService.emit(SocketEvtNames.CHAT_SENT, tempChat);
    
    console.table(tempChat);

    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
    this.previewMsgId = '';

    this.inputTextBox.setValue('');
    this.inputTextInValid = false;
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  clickReplayMessage(chatContent: string, msgId: string) {
    this.showPreviewMessage = true;
    this.replayingToPreviewMsg = (chatContent.length > 20) ? 
      `${chatContent.slice(0, 20)} . . .` : chatContent;
    this.previewMsgId = msgId;
    this.scrollToBottom();
  }

  closePreview() {
    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
    this.previewMsgId = '';
  }

  private getFormattedTime(): string {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    return `${hours}:${minutes} ${ampm}`;
  }

  private scrollToBottom () : void {
    try {
      this.chatboxlistarea.nativeElement.scrollTo({
        top: this.chatboxlistarea.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  ngOnDestroy(): void {
    
  }

}
