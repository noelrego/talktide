import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable, Subscription } from 'rxjs';
import { AvailableUserType, CreateMemberType, MemberListType, SocketEvtNames, UserInfoType } from '../../common';
import { Store } from '@ngrx/store';
import { A_particularUserLoggedout, A_insertAvailableUserList, A_insertMembers, S_availableUserList, S_membersList, S_userInfo, S_userState } from '../../STORE';
import { ApiDataService } from '../../service/api';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit, AfterContentInit, OnDestroy {

  selectedRecipient: string = '';
  memberList: any = [];

  loggedInUser : UserInfoType | null;

  availableUserList$: Observable<AvailableUserType[]>;
  loggedInUser$: Observable<UserInfoType | null>;
  userStatus$: Observable<string | null>;
  memberList$: Observable<MemberListType[]>

  socketSomeoneLoggedIn$: Subscription;
  socketSomeoneLoggedOut$: Subscription;
  socketCreatedChatMember$: Subscription;
  socketCreatedChatMemberSelf$: Subscription;

  constructor(
    private socketService: SocketService,
    private store: Store,
    private apiData: ApiDataService
  ) {
    this.availableUserList$ = this.store.select(S_availableUserList);
    this.loggedInUser$ = this.store.select(S_userInfo);
    this.userStatus$ = this.store.select(S_userState);
    this.memberList$ = this.store.select(S_membersList);
  }

  ngOnInit(): void {

    /* Connect to Socket if not connected */
    console.log('[SOCKET] Socket state: ', this.socketService.socketConnected);
    if (!this.socketService.socketConnected) {
      this.socketService.connectSocket();
    }

    /* Update user info state */
    this.loggedInUser$.subscribe(res => {
      this.loggedInUser = (res?.authId) ? res: null;
    })

    /* Update Initial State to server on Page refresh! */
    this.userStatus$.subscribe(res =>
      this.socketService.emit(SocketEvtNames.CHANGE_USER_STATE, res)
    );

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
      console.log('[CREATED_CHAT_MEMBER] ---------------')
      this.fnGetMemberList();
    });

    this.socketCreatedChatMemberSelf$ = this.socketService.onEvent(SocketEvtNames.CREATED_CHAT_MEMBER_SELF).subscribe(res => {
      console.log('[CREATED_CHAT_MEMBER_SELF] ---------------')
      this.fnGetMemberList();
    });

    /* API Initial call to get available user list */
    this.fnGetMemberList();




  }


  /* To set in state for Selected user for chat */
  selectRecipient(recipientId: string): void {
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


    // this.loggedInUser$.subscribe(res => {

    // const members: CreateMemberType = {
    //   memebrToCreateWith: userInfo. // Alwayd ID present
    //   clientId: userInfo.authId
    // }
    //   console.log(members)

    //   this.store.dispatch(A_deleteAvailableUser({
    //     authId: userInfo.authId
    //   }))

    // })

  }

  /* ------------------ Functions ----------------------------*/

  // API to get the member list
  private fnGetMemberList(): void {
    this.apiData.getmemberList().subscribe({
      next: (response) => {
        console.log('[API] Members list ', response.body);
        const availableList = response.body.resData.memberInfo;
        if (availableList.length > 0) {
          console.log('[MEMBERS] : List found adding to store')
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
        console.log('[API] Avilable users list ', response.body);
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
  }

}
