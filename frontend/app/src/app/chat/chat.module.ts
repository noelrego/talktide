import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RecipientsComponent } from './recipients/recipients.component';


@NgModule({
  declarations: [
    ChatWindowComponent,
    ChatBoxComponent,
    RecipientsComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
