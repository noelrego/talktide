import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RecipientsComponent } from './recipients/recipients.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketService } from './socket/socket.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCustomInterceptor } from '../config/http-intercepter.cofig';


@NgModule({
  declarations: [
    ChatWindowComponent,
    ChatBoxComponent,
    RecipientsComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCustomInterceptor,
      multi: true
    }
  ]
})
export class ChatModule { }
