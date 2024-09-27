import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiDataService } from '../service/api';
import { LoginUserDto } from '../common';
import { CustomCookieService } from '../service/api/cookie/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Login | Talk Tide';

  loginForm: FormGroup;
  invalidUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiData: ApiDataService,
    private myCookie : CustomCookieService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

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
            this.router.navigate(['/chat']);
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
