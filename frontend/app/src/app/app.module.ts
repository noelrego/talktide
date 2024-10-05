import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpCustomInterceptor } from './config/http-intercepter.cofig';
import { ApiDataService } from './service/api';
import { CustomCookieService } from './service/cookie/cookie.service';
import { StoreModule } from '@ngrx/store';
import { R_setUserLoggedin } from './STORE/chat.reducer';
import { LocalStrgService } from './service/localstorage';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({'chatapp': R_setUserLoggedin})
  ],
  providers: [
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true },
    ApiDataService,
    CustomCookieService,
    LocalStrgService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
