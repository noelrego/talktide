import { Component, ElementRef, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit{

  recipientList : any;
  selectedRecipient: number = -1;
  avilableUsersList : any;

  constructor (
    private socketService: SocketService
  ) {}

  ngOnInit(): void {

    this.socketService.onEvent('B_LIN').subscribe(data => {
      console.log('Data from server LOGIN:', data);
    });

    this.socketService.onEvent('B_LOUT').subscribe(data => {
      console.log('Data from server SOMEONE LOGOUT:', data);
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
