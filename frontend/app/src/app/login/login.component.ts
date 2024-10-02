import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiDataService } from '../service/api';
import { LoginUserDto, ProvideReducerName, UserInfoType, UserStatus } from '../common';
import { CustomCookieService } from '../service/cookie/cookie.service';
import { Store } from '@ngrx/store';
import { A_setUserInfo, A_userLoggedin } from '../STORE/chat.action';
import { Observable } from 'rxjs';
import { S_loggedInstate, TalkTideState } from '../STORE';
import { LocalStrgService } from '../service/localstorage/ls.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Login | Talk Tide';

  loginForm: FormGroup;
  invalidUser: boolean = false;

  LOGGED_IN$ : Observable<boolean | null>;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private apiData: ApiDataService,
    private myCookie : CustomCookieService,
    private lsService: LocalStrgService
  ) {
    this.LOGGED_IN$ = this.store.select(S_loggedInstate);
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { 
    if(this.myCookie.hasTokenCookie()) {
      this.router.navigate(['chat']);
    }
   }

  usernameValidator(control: AbstractControl): { [key: string]: any } | null {
    const usernamePattern = /^[a-z0-9_-]+$/; // Allows small letters, digits, underscores, and hyphens
    return usernamePattern.test(control.value) ? null : { invalidUsername: true };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted!', this.loginForm.value);

      const payload : LoginUserDto = {
        userName: this.loginForm.value.username,
        password: this.loginForm.value.password
      }

      this.apiData.loginUser(payload).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.myCookie.setTokenCookie(response.body?.resData?.accessToken);

            // Dispatch to update logged in state
            this.store.dispatch(A_userLoggedin({isLoggedIn: true}));

            let tempUserInfo : UserInfoType = {
              authId: response.body?.resData?.userInfo?.authId,
              userName: response.body?.resData?.userInfo?.username,
              fullName: response.body?.resData?.userInfo?.fullName
            }
            // Set unser info in State and Local storage
            this.lsService.setUserInfo(tempUserInfo);
            this.lsService.setUserStatus(UserStatus.AVAILABLE);

            // Update state
            this.store.dispatch(A_setUserInfo({
              userInfo: tempUserInfo
            }));
            
            this.router.navigate(['/chatapp']);
          }
        },
        error: (err) => {
          this.invalidUser = true;
          setTimeout(() => {
              this.invalidUser = false;
          }, 2500);
          console.log(err);
          this.loginForm.reset();
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
