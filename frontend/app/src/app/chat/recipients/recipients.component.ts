import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css'
})
export class RecipientsComponent implements OnInit{

  receipientList : any;
  selectedReceipient: number = -1; 

  constructor () {}

  ngOnInit(): void {
    this.receipientList = [
      {
        id: 1,
        fullName: 'Noel Rego',
        status: 'away',
        msgPreview: 'Hi Hellow Dollay . . . .',
        time: '11:00 AM'
      },
      {
        id: 2,
        fullName: 'Anna',
        status: 'busy',
        msgPreview: 'Hi Hellow Dollay . . . .',
        time: '12:00 AM'
      },
      {
        id: 3,
        fullName: 'Noel Rego',
        status: 'away',
        msgPreview: 'Hi ',
        time: '10:00 PM'
      },
      {
        id: 4,
        fullName: 'John',
        status: 'away',
        msgPreview: 'Hi Beo',
        time: '11:00 AM'
      },
      {
        id: 5,
        fullName: 'Robin',
        status: 'away',
        msgPreview: 'Hi ok. . . .',
        time: '11:00 AM'
      },
      {
        id: 6,
        fullName: 'Noel Rego',
        status: 'away',
        msgPreview: 'oklk.',
        time: '11:00 AM'
      },
      {
        id: 7,
        fullName: 'Posh',
        status: 'away',
        msgPreview: 'Hi oklk.',
        time: '11:00 AM'
      },
      {
        id: 8,
        fullName: 'Marray',
        status: 'away',
        msgPreview: 'Hi Hellow Dollay . . . .',
        time: '11:00 AM'
      },

    ] ;
  }

  selectRipient(id: number) : void {
    console.log('Selected Receie', id);
    this.selectedReceipient = id;
  }

}
