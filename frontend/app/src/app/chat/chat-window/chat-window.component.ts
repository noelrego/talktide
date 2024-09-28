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
  userInfo : UserInfoType | null = null;
  
  constructor (
    private store: Store,
  ) {
    this.userInfo$ = this.store.select(S_userInfo);
  }

  ngOnInit(): void {
    console.log(this.userInfo$.forEach(item => {
      this.userInfo = item;

      console.log(this.userInfo);
    }));
  }

  ngOnDestroy(): void {
    
  }
}
