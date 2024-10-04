import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable, Subscription } from 'rxjs';
import { AvailableUserType, CreateMemberType, SocketEvtNames, UserInfoType } from '../../common';
import { Store } from '@ngrx/store';
import { A_deleteAvailableUser, A_insertAvailableUser, A_insertAvailableUserList, A_otherUserChangedState, S_availableUserList, S_userInfo, S_userState } from '../../STORE';
import { ApiDataService } from '../../service/api';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit, AfterContentInit, OnDestroy{

  selectedRecipient: string = '';
  memberList: any = []

  availableUserList$ : Observable<AvailableUserType[]>;
  loggedInUser$ : Observable<UserInfoType | null>;
  userStatus$ : Observable<string | null>;

  B_LIN$ : Subscription;
  USER_LOGGEDOUT$ : Subscription;
  USER_LOGGEDIN$ : Subscription;
  USER_CHANGED_STATE$ : Subscription;

  constructor (
    private socketService: SocketService,
    private store: Store,
    private apiData: ApiDataService
  ) {
    this.availableUserList$ = this.store.select(S_availableUserList);
    this.loggedInUser$ = this.store.select(S_userInfo);
    this.userStatus$ = this.store.select(S_userState);
  }

  ngOnInit(): void {


     // Connect to Socket if not connected
    console.log('[SOCKET] Socket state: ', this.socketService.socketConnected);
    if(!this.socketService.socketConnected) {
      this.socketService.connectSocket();
    }
    

    // Update Initial State to server on Page refresh!
    this.userStatus$.subscribe(res => 
      this.socketService.emit(SocketEvtNames.CHANGE_USER_STATE, res)
    );

    // API Initial call to get available user list
    this.fnGetMemberList();
    this.fnGetAvailableList();


    // this.USER_CHANGED_STATE$ = this.socketService.onEvent('USER_CHANGED_STATE').subscribe(res => {
    //   console.log('[SOCKET RECEIVE] Some one chnaged the status', res);
    //   this.store.dispatch(A_otherUserChangedState({
    //     authId: res.authId,
    //     newState: res.userStatus
    //   }))
    // })

    //Subscribe to user who logs out
    // this.USER_LOGGEDOUT$ = this.socketService.onEvent('USER_LOGGEDOUT').subscribe(data => {
    //   console.log('[SOCKET RECEIVE] USER_LOGGEDOUT: ', data);

    //   this.store.dispatch(A_deleteAvailableUser({
    //     authId: data
    //   }))
    // });

    //Subscribe to socket event
    // this.USER_LOGGEDIN$ = this.socketService.onEvent('USER_LOGGEDIN').subscribe(data => {
    //   console.log('[SOKET RECEIVE]------ Some one logged in: ', data);

    //   const loggedInUser = this.loggedInUser$.subscribe(item =>  { 
    //     if (item?.authId !== data.authId) {
    //       this.store.dispatch(A_insertAvailableUser({
    //         availableUser: data
    //       }))
    //     }
    //   });
      
      // this.availableUserList$.subscribe(item => console.log(item));
      // this.store.dispatch(A_insertAvailableUser({
      //   availableUser: data
      // }))
    // })


    // this.availableUserList$.subscribe(res => console.log(' [STATE] available user list: ', res))
    // this.loggedInUser$.subscribe(res => console.log(' [STATE] logged in userinfo: ', res))

  }

  // To set in state for Selected user
  selectRecipient(recipientId: number): void {
  }

  
  // To create a chat History from Selected Available list
  createChatHistory(userInfo: any) : void {

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
  private fnGetMemberList() : void {
    this.apiData.getmemberList().subscribe({
      next: (response) => {
        console.log('[API] Members list ',response.body);
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

  // API to get the list of Available users and not in Member list
  private fnGetAvailableList (): void {
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
    // this.B_LIN$.unsubscribe();
    // this.USER_LOGGEDOUT$.unsubscribe();
    // this.USER_LOGGEDIN$.unsubscribe();
    // this.USER_CHANGED_STATE$.unsubscribe();
  }

}
