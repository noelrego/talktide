import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { ApiDataService } from '../service/api';
import { CustomCookieService } from '../service/cookie/cookie.service';

class MockApiDataService {
  checkUserName = jasmine.createSpy('checkUserName').and.callFake((username: string) => {
    return of({ status: 200, body: { message: 'User name available' } });
  });

  registerUser = jasmine.createSpy('registerUser').and.callFake((payload: any) => {
    return of({ status: 201 });
  });
}

class MockCustomCookieService {
  hasTokenCookie = jasmine.createSpy('hasTokenCookie').and.returnValue(false); // Default to false
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockApiDataService: jasmine.SpyObj<ApiDataService>;
  let apiDataService: ApiDataService;
  let cookieService: CustomCookieService;
  let router: Router;

  beforeEach(async () => {
    mockApiDataService = jasmine.createSpyObj('ApiDataService', ['registerUser']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: ApiDataService, useValue: mockApiDataService },
        { provide: ApiDataService, useClass: MockApiDataService },
        { provide: CustomCookieService, useClass: MockCustomCookieService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    apiDataService = TestBed.inject(ApiDataService);
    cookieService = TestBed.inject(CustomCookieService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the register form', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.controls['username']).toBeDefined();
    expect(component.registerForm.controls['firstName']).toBeDefined();
    expect(component.registerForm.controls['lastName']).toBeDefined();
    expect(component.registerForm.controls['password']).toBeDefined();
    expect(component.registerForm.controls['confirmPassword']).toBeDefined();
  });

  it('should not check username if it is less than 3 chars', () => {
    component.registerForm.controls['username'].setValue('ab');
    component.checkUserName({});
    expect(apiDataService.checkUserName).not.toHaveBeenCalled();
  });

  it('should check username availability', () => {
    component.registerForm.controls['username'].setValue('validUsername');
    component.checkUserName({});
    expect(apiDataService.checkUserName).toHaveBeenCalledWith('validUsername');
    expect(component.userAvailable).toBeTrue();
    expect(component.userAvailableResponse).toBe('User name available');
  });

  it('should submit the registration form if valid', () => {
    component.registerForm.controls['username'].setValue('oneuser');
    component.registerForm.controls['firstName'].setValue('Noe');
    component.registerForm.controls['lastName'].setValue('Rego');
    component.registerForm.controls['password'].setValue('Chatapp1');
    component.registerForm.controls['confirmPassword'].setValue('Chatapp1');
    component.userAvailable = true; // Simulating that username is available

    component.onSubmit();
    expect(apiDataService.registerUser).toHaveBeenCalledWith({
      userName: 'oneuser',
      firstName: 'Noe',
      lastName: 'Rego',
      password: 'Chatapp1'
    });
  });


  it('should validate matching passwords', () => {
    const formGroup = new FormGroup({
      password: new FormControl('password12'),
      confirmPassword: new FormControl('password1234')
    });
    component.matchingPasswords('password', 'confirmPassword')(formGroup);
    expect(formGroup.controls['confirmPassword'].errors).toEqual({ matchingPasswords: true });

    formGroup.controls['confirmPassword'].setValue('password12');
    component.matchingPasswords('password', 'confirmPassword')(formGroup);
    expect(formGroup.controls['confirmPassword'].errors).toBeNull();
  });

});
