import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable, Subscription } from 'rxjs';
import { AvailableUserType, SocketEvtNames, UserInfoType } from '../../common';
import { Store } from '@ngrx/store';
import { A_deleteAvailableUser, A_insertAvailableUser, A_insertAvailableUserList, S_availableUserList, S_userInfo } from '../../STORE';

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

  constructor (
    private socketService: SocketService,
    private store: Store
  ) {
    this.availableUserList$ = this.store.select(S_availableUserList);
    this.loggedInUser$ = this.store.select(S_userInfo);
  }

  ngOnInit(): void {

    console.log('[SOCKET] Socket state: ', this.socketService.socketConnected);
    if(!this.socketService.socketConnected) {
      this.socketService.connectSocket();
    }

    this.availableUserList$.subscribe(res => console.log(' [STATE] available user list: ', res))
    this.loggedInUser$.subscribe(res => console.log(' [STATE] logged in userinfo: ', res))

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
            "authId": "1",
            "userName": "one",
            "fullName": "One 1",
            "userStatus": "available"
        },
        {
            "authId": "2",
            "userName": "one",
            "fullName": "One 1",
            "userStatus": "busy"
        },
        {
            "authId": "3",
            "userName": "one",
            "fullName": "One 1",
            "userStatus": "offline"
        }
    ]
  }

  // To set in state for Selected user
  selectRecipient(recipientId: number): void {
    this.selectedRecipient = recipientId;
  }

  
  // To create a chat History from Selected Available list
  createChatHistory(userInfo: any) : void {
    console.log('To create chat History: ', userInfo);

  }

  ngAfterContentInit(): void {
    this.socketService.emit(SocketEvtNames.REQUEST_LOGGEDINUSERS, {});
  }
  

  ngOnDestroy(): void {
  }

}
