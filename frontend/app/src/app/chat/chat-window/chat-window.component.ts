import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { S_loggedInstate, S_userInfo, TalkTideState } from '../../STORE';
import { ProvideReducerName, UserInfoType } from '../../common';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit, OnDestroy{

  loggedInstate: any = 'Setting Now';
  s : boolean = true;
  userInfo$ : Observable<UserInfoType | null>;
  isLoggedIn$ : Observable<boolean | null>;
  
  constructor (
    private store: Store,
  ) {
    this.userInfo$ = this.store.select(S_userInfo);
    this.isLoggedIn$ = this.store.select(S_loggedInstate);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
