import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { S_loggedInstate, S_userInfo, TalkTideState } from '../../STORE';
import { ProvideReducerName, UserInfoType } from '../../common';
import { CustomCookieService } from '../../service/cookie/cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy{

  username = 'Charles';
  status = 'ready';
  isActive = false;

  recipients = [
    { name: 'Jane Doe', logo: 'path_to_logo1.jpg' },
    { name: 'John Smith', logo: 'path_to_logo2.jpg' },
    
  ];

  messages = [
    { sender: 'Jane Doe', text: 'Good morning Charles!' },
    { sender: 'Jane Doe', text: 'How are you?' },
    // More chat messages...
  ];

  newMessage = '';

  constructor (
    private myCookie: CustomCookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  toggleBurgerMenu() {
    this.isActive = !this.isActive;
  }

  logout() {
    // Handle logout
    console.log('Logging out...');
    this.myCookie.deleteCookie();
    this.router.navigate(['/login'])

  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'Charles', 
        text: this.newMessage
      });
      this.newMessage = '';
    }
  }



  ngOnDestroy(): void {
    
  }
}
