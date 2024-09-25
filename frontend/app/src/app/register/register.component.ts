import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  title = 'Register | Talk Tide';

  registerForm: FormGroup;
  isProceedClicked: boolean = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      firstName: ['', Validators.required],
      lastName: [''],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  ngOnInit(): void {}

  onProceed() {
    if (this.registerForm.get('username')?.invalid) {
      this.isProceedClicked = false;
    } else {
      this.isProceedClicked = true;
    }
    
  }

  togglePasswordVisibility() {

    this.showPassword = !this.showPassword;
  }

  usernameValidator(control: AbstractControl): { [key: string]: any } | null {
    const usernamePattern = /^[a-z0-9_-]+$/; // Allows small letters, digits, underscores, and hyphens
    return usernamePattern.test(control.value) ? null : { invalidUsername: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Registration Form Submitted!', this.registerForm.value);
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
