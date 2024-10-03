import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthRouteGuard } from './common';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', 
    component: LoginComponent,
  },
  {
    path: 'register', 
    component: RegisterComponent
  },
  {
    path: 'chatapp', 
    canActivate: [AuthRouteGuard],
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
