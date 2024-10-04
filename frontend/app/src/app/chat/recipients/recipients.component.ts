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

  recipientList : any;
  selectedRecipient: number = -1;
  avilableUsersList : any;

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

    // API call to get available user list
    this.apiData.getAvailableUserList().subscribe({
      next: (response) => {

        const availableList: [] = response.body.resData;
        if (availableList.length > 0) {
          console.log('API RESPONSE: ', availableList);
          this.store.dispatch(A_insertAvailableUserList({
            availableUsersList: availableList
          }))
        }

      }, 
      error: (err) => {
        console.error(err.toString());
      }
    })


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

    this.recipientList = [
      
      {
        id: 7,
        fullName: 'Posh',
        status: 'available',
        msgPreview: 'Hi oklk.',
        time: '11:00 AM'
      },
      {
        id: 8,
        fullName: 'Marray',
        status: 'busy',
        msgPreview: 'Hi Hellow Dollay . . . .',
        time: '11:00 AM'
      },

    ] ;


    this.avilableUsersList = [
          {
              "id": 10,
              "userName": "two",
              "fullName": "Two do",
              "userStatus": "available"
          }
    ]
  }

  // To set in state for Selected user
  selectRecipient(recipientId: number): void {
    this.selectedRecipient = recipientId;
  }

  
  // To create a chat History from Selected Available list
  createChatHistory(userInfo: any) : void {

    this.loggedInUser$.subscribe(res => {

      const members: CreateMemberType = {
        firstRecipient: (res?.authId) ? res.authId : '', // Alwayd ID present
        secondRecipient: userInfo.authId
      }
      console.log(members)
      this.socketService.emit(SocketEvtNames.CREATE_MEMBER_BY_AVAILABLE_LIST, members);

      this.store.dispatch(A_deleteAvailableUser({
        authId: userInfo.authId
      }))

    })
    

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
