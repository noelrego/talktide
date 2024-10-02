import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { A_setUserState, S_loggedInstate, S_userInfo, S_userState, TalkTideState } from '../../STORE';
import { ProvideReducerName, UserInfoType } from '../../common';
import { CustomCookieService } from '../../service/cookie/cookie.service';
import { Router } from '@angular/router';
import { FormControl, ValueChangeEvent } from '@angular/forms';
import { SocketService } from '../socket/socket.service';
import { LocalStrgService } from '../../service/localstorage';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy{

  username : string | undefined= '';
  status = 'ready';
  isActive = false;
  
  selectOption = new FormControl('');

  recipients = [
    { name: 'Jane Doe', logo: 'path_to_logo1.jpg' },
    { name: 'John Smith', logo: 'path_to_logo2.jpg' },
    
  ];

  messages = [
    { sender: 'Jane Doe', text: 'Good morning Charles!' },
    { sender: 'Jane Doe', text: 'How are you?' },
  ];

  newMessage = '';

  userInfo$ : Observable<UserInfoType | null>;
  userStatus$ : Observable<string | null>;

  constructor (
    private store: Store,
    private myCookie: CustomCookieService,
    private router: Router,
    private socketService: SocketService,
    private lsService: LocalStrgService
  ) {
    this.userInfo$ = this.store.select(S_userInfo);
    this.userStatus$ = this.store.select(S_userState);
  }

  ngOnInit(): void {
    this.userInfo$.subscribe(res => {
      this.username = res?.fullName
    });

    this.userStatus$.subscribe(res => {
      this.selectOption.setValue(res);
    })

    // V18 Angular Documentation
   this.selectOption.events.subscribe(e => {
    if (e instanceof ValueChangeEvent) {
      this.store.dispatch(A_setUserState({userState: e.source.value}));
      
      // Update LocalStorage
      this.lsService.setUserStatus(e.source.value);
    }
   })

  }

  toggleBurgerMenu() {
    this.isActive = !this.isActive;
  }

  logout() {
    // Handle logout
    console.log('Logging out...');
    this.myCookie.deleteCookie();
    this.lsService.deleteLocalStorage();
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
    this.socketService.disconnect();
  }
}
