import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable, Subscription } from 'rxjs';
import { AvailableUserType, CreateMemberType, MemberListType, SelectedRecipientChatType, SocketEvtNames, UserInfoType } from '../../common';
import { Store } from '@ngrx/store';
import { A_particularUserLoggedout, A_insertAvailableUserList, A_insertMembers, S_availableUserList, S_membersList, S_userInfo, S_userState, A_updateRemoteUserStatus, A_setSelectedRecipient, S_selectedRecipient, A_updateChatHistory, A_resetChatHistory, A_pushNewChatContent, A_chatNotify } from '../../STORE';
import { ApiDataService } from '../../service/api';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit, AfterContentInit, OnDestroy {

  selectedRecipient: string = '';
  memberList: any = [];

  loggedInUser: UserInfoType | null;

  availableUserList$: Observable<AvailableUserType[]>;
  loggedInUser$: Observable<UserInfoType | null>;
  userStatus$: Observable<string | null>;
  memberList$: Observable<MemberListType[]>;
  selectedRecipient$: Observable<SelectedRecipientChatType | null>;

  socketSomeoneLoggedIn$: Subscription;
  socketSomeoneLoggedOut$: Subscription;
  socketCreatedChatMember$: Subscription;
  socketCreatedChatMemberSelf$: Subscription;
  sockerUserChangedStatus$: Subscription;
  socketChatNotification$: Subscription;

  constructor(
    private socketService: SocketService,
    private store: Store,
    private apiData: ApiDataService
  ) {
    this.availableUserList$ = this.store.select(S_availableUserList);
    this.loggedInUser$ = this.store.select(S_userInfo);
    this.userStatus$ = this.store.select(S_userState);
    this.memberList$ = this.store.select(S_membersList);
    this.selectedRecipient$ = this.store.select(S_selectedRecipient);
  }

  ngOnInit(): void {

    /* Connect to Socket if not connected */
    if (!this.socketService.socketConnected) {
      this.socketService.connectSocket();
    }

    /* Update user info state */
    this.loggedInUser$.subscribe(res => {
      this.loggedInUser = (res?.authId) ? res : null;
    })

    /* Update Initial State to server on Page refresh! */
    // this.userStatus$.subscribe(res =>
    //   this.socketService.emit(SocketEvtNames.CHANGE_USER_STATE, res)
    // );

    /* - - - - - - - - - Regitser socket events - - - - - - - - - - -  */
    this.socketSomeoneLoggedIn$ = this.socketService.onEvent(SocketEvtNames.SOMEONE_LOGGEDIN).subscribe(res => {
      if (this.loggedInUser?.authId !== res) {
        this.fnGetMemberList();
      }
    });

    this.socketSomeoneLoggedOut$ = this.socketService.onEvent(SocketEvtNames.SOMEONE_LOGGEDOUT).subscribe(res => {
      this.store.dispatch(A_particularUserLoggedout({
        authId: res
      }));
    });

    this.socketCreatedChatMember$ = this.socketService.onEvent(SocketEvtNames.CREATED_CHAT_MEMBER).subscribe(res => {
      this.fnGetMemberList();
    });

    this.socketCreatedChatMemberSelf$ = this.socketService.onEvent(SocketEvtNames.CREATED_CHAT_MEMBER_SELF).subscribe(res => {
      this.fnGetMemberList();
    });

    this.sockerUserChangedStatus$ = this.socketService.onEvent(SocketEvtNames.USER_CHANGED_STATUS).subscribe(res => {
      this.store.dispatch(A_updateRemoteUserStatus({
        authId: res.authId,
        newStatus: res.newStatus
      }))
    });

    this.socketChatNotification$ = this.socketService.onEvent(SocketEvtNames.CHAT_NOTIFY).subscribe(res => {
      console.log('[NOTIFY MESSAGE]');

      // Check if selected participant is same
      this.store.dispatch(A_chatNotify({
        chatContent: res
      }))
    })

    /* - - - -  - - - - - API Initial call to get available user list - - - - - -*/
    this.fnGetMemberList();




  }


  /* To set in state for Selected user for chat */
  selectRecipient(recipient: MemberListType): void {
    console.log('[SELECTED RECIPIENT] ', recipient);
    const selectedInfo: SelectedRecipientChatType = {
      recipientAuthId: recipient.recipientAuthId,
      recipientFullName: recipient.fullName,
      clientId: recipient.clientId,
      memberId: recipient.memberId
    }

    this.store.dispatch(A_setSelectedRecipient({
      selectedRecipient: selectedInfo
    }));

    this.getChatHistory(recipient.memberId);

  }


  /* To create a chat History from Selected Available list */
  createChatHistory(userInfo: any): void {

    this.loggedInUser$.subscribe((res) => {

      const payload: CreateMemberType = {
        firstMember: (res?.authId) ? res.authId : '', // Always id present
        secondMember: userInfo.authId,
        clientId: userInfo.clientId
      }
      this.socketService.emit(SocketEvtNames.CREATE_MEMBER_BY_AVAILABLE_LIST, payload);
    })

  }

  /* ------------------ Functions ----------------------------*/

  // API to get the member list
  private fnGetMemberList(): void {
    this.apiData.getmemberList().subscribe({
      next: (response) => {
        const availableList = response.body.resData.memberInfo;
        if (availableList.length > 0) {

          this.store.dispatch(A_insertMembers({
            memberList: availableList
          }));
        }
        this.fnGetAvailableList();

      },
      error: (err) => {
        console.error(err.toString());
      }
    });
  }

  // API to get the list of Available users and not in Member list
  private fnGetAvailableList(): void {
    this.apiData.getAvailableUserList().subscribe({
      next: (response) => {
        const availableList: [] = response.body.resData;
        if (availableList.length > 0) {

          this.store.dispatch(A_insertAvailableUserList({
            availableUsersList: availableList
          }))
        }

      },
      error: (err) => {
        console.error(err.toString());
      }
    });
  }

  // To get the chat history 
  private getChatHistory(memberId: string): void {
    this.apiData.getChatHistory(memberId).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {

          // Update the store with new message
          this.store.dispatch(A_updateChatHistory({
            chatContents: response.body.resData
          }))
        } else {

          this.store.dispatch(A_resetChatHistory()); //Reset the message
        }

      },
      error: (err) => console.error(err.toString())
    })
  }

  ngAfterContentInit(): void {

    // Get the available Logged in users 
    // this.socketService.emit(SocketEvtNames.REQUEST_LOGGEDINUSERS, {});

    // Get the Chat History Recipient list
    // this.socketService.emit(SocketEvtNames.GET_RECIPIENT_LIST, {});
  }


  ngOnDestroy(): void {
    this.socketSomeoneLoggedIn$.unsubscribe();
    this.socketSomeoneLoggedOut$.unsubscribe();
    this.socketCreatedChatMemberSelf$.unsubscribe();
    this.sockerUserChangedStatus$.unsubscribe();
    this.socketChatNotification$.unsubscribe();
  }

}
