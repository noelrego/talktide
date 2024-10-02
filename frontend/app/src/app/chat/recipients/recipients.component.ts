import { Component, ElementRef, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs';
import { AvailableUserType } from '../../common';
import { Store } from '@ngrx/store';
import { A_insertAvailableUserList, S_availableUserList } from '../../STORE';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit{

  recipientList : any;
  selectedRecipient: number = -1;
  avilableUsersList : any;

  availableUserList$ : Observable<AvailableUserType[]>;

  constructor (
    private socketService: SocketService,
    private store: Store
  ) {
    this.availableUserList$ = this.store.select(S_availableUserList);
  }

  ngOnInit(): void {

    this.socketService.onEvent('B_LIN').subscribe(data => {

      this.store.dispatch(A_insertAvailableUserList({
        availableUsersList: data
      }));
      console.log('Data from server LOGIN:');
    });

    this.socketService.onEvent('B_LOUT').subscribe(data => {
    });

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

}
