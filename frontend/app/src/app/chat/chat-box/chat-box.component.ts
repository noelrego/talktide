import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
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

  newMessage: string = '';
  showPreviewMessage: boolean = false;
  replayingToPreviewMsg: string = '';

  loggedInUser : UserInfoType | null;
  loggedInUser$: Observable<UserInfoType | null>;

  selectedRecipient$ : Observable<SelectedRecipientChatType | null>;
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
    } else {
      this.inputTextInValid = false;
    }
    console.log(' [SEND MESSAGE] to be constructed new chat: ');
    console.log(this.inputTextBox.value);
  }

  clickReplayMessage(chatInfo: ChatHistoryType) {
    console.table(chatInfo);
    this.replayingToPreviewMsg = 'TO DO BOY SO CLOSE' + ' . . .';
  }

  closePreview() {
    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
  }

  ngOnDestroy(): void {
    
  }

}
