import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiDataService } from '../service/api';
import { RegisterUserDto } from '../common';
import { Router } from '@angular/router';
import { CustomCookieService } from '../service/cookie/cookie.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  title = 'Register | Talk Tide';

  registerForm: FormGroup;
  isProceedClicked: boolean = false;
  registerSuccess = false;

  userAvailableResponse: string = '';
  userAvailable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiData: ApiDataService,
    private router: Router,
    private myCookie: CustomCookieService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z1-9 ]*$/)]],
      lastName: ['', [Validators.pattern(/^[a-zA-Z1-9 ]*$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  ngOnInit(): void {
    if(this.myCookie.hasTokenCookie()) {
      this.router.navigate(['chat']);
    }
   }

  checkUserName(event: any) {
    const userName = this.registerForm.get('username')?.value;
    if (!userName) return;
    if (userName?.length < 3) {
      this.userAvailable = false;
      this.userAvailableResponse = '';
      return;
    }

    this.apiData.checkUserName(userName).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.userAvailable = true;
          this.userAvailableResponse = response.body.message;
        }
      },
      error: (err) => {
        this.userAvailable = false;
        this.userAvailableResponse = 'User name not available'
      }
    });

  }

  usernameValidator(control: AbstractControl): { [key: string]: any } | null {
    const usernamePattern = /^[\sa-z0-9_-]+$/; // Allows small letters, digits, underscores, and hyphens
    return usernamePattern.test(control.value) ? null : { invalidUsername: true };
  }

  nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const usernamePattern = /^[a-z0-9_A-Z-]+$/; // Allows small letters, digits, underscores, and hyphens
    return usernamePattern.test(control.value) ? null : { invalidName: true };
  }

  onSubmit() {
    if (!this.userAvailable) return;
    if (this.registerForm.valid) {

      // Make API Call
      const payload: RegisterUserDto = {
        userName: this.registerForm.value.username,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        password: this.registerForm.value.password
      }
      this.apiData.registerUser(payload).subscribe({
        next: (response) => {
          if (response.status === 201) {
            this.userAvailable = false;
            this.userAvailableResponse = '';
            this.registerForm.reset();
            this.registerForm.markAsPending();
            this.registerSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/login'])
            }, 2000);
          }
        },
        error: (err) => {
          console.error(err);
          // this.registerForm.reset();
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // Custom validator to check if passwords match
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordKey];
      const confirmPassword = formGroup.controls[confirmPasswordKey];

      if (confirmPassword.errors && !confirmPassword.errors['matchingPasswords']) {
        return;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ matchingPasswords: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }

  // Custom validator to check password strength
  passwordValidator(control: any) {
    const value = control.value;
    if (!/[0-9]/.test(value)) {
      return { weakPassword: true }; // At least one number is required
    }
    return null;
  }

}
