import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: ChatWindowComponent
  },
  {
    path: '**', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
