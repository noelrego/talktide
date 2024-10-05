import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ChatHistoryType, SelectedRecipientChatType, UserInfoType } from '../../common';
import { S_chatHistoryList, S_selectedRecipient, S_userInfo } from '../../STORE';
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
    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
    this.inputTextBox.setValue('');
    this.inputTextInValid = false;

    // Construct message 
    // const tempChat : ChatHistoryType = {
    //   msgId: `tempmsg_id${this.tempMsgId++}`,
    //   memberId: 
    // }
    
    console.log(' [SEND MESSAGE] to be constructed new chat: ');
    console.log(this.inputTextBox.value);
  }

  clickReplayMessage(chatContent: string) {
    this.showPreviewMessage = true;
    this.replayingToPreviewMsg = (chatContent.length > 20) ? 
      `${chatContent.slice(0, 20)} . . .` : chatContent;
    try {
      this.chatboxlistarea.nativeElement.scrollTo({
        top: this.chatboxlistarea.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  closePreview() {
    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
  }

  ngOnDestroy(): void {
    
  }

}
