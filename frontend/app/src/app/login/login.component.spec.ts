import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ApiDataService } from '../service/api';
import { CustomCookieService } from '../service/cookie/cookie.service';
import { LocalStrgService } from '../service/localstorage/ls.service';
import { LoginComponent } from './login.component';
import { A_userLoggedin, A_setUserInfo } from '../STORE/chat.action';
import { HttpResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockApiDataService: jasmine.SpyObj<ApiDataService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockCookieService: jasmine.SpyObj<CustomCookieService>;
  let mockLocalStrgService: jasmine.SpyObj<LocalStrgService>;

  beforeEach(async () => {
    mockApiDataService = jasmine.createSpyObj('ApiDataService', ['loginUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockCookieService = jasmine.createSpyObj('CustomCookieService', ['hasTokenCookie', 'setTokenCookie']);
    mockLocalStrgService = jasmine.createSpyObj('LocalStrgService', ['setUserInfo', 'setUserStatus']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule, 
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: ApiDataService, useValue: mockApiDataService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: CustomCookieService, useValue: mockCookieService },
        { provide: LocalStrgService, useValue: mockLocalStrgService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create the component', () => {
    expect(component).toBeTruthy();
  });

  xit('should initialize the Login form', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  xit('should validate username', () => {
    const usernameControl = component.loginForm.controls['username'];

    usernameControl.setValue('valid_username123');
    expect(usernameControl.valid).toBeTrue();

    usernameControl.setValue('invalid@username!');
    expect(usernameControl.valid).toBeFalse();
    expect(usernameControl.errors).toEqual({ invalidUsername: true });
  });

  xit('should navigate to chat if token cookie is present', () => {
    mockCookieService.hasTokenCookie.and.returnValue(true);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['chat']);
  });

  xit('should not navigate protect the route', () => {
    mockCookieService.hasTokenCookie.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  xit('should mark mark form as touched', () => {
    spyOn(component.loginForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  xit('should call login API and do login', () => {
    const mockResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: {
        resData: {
          accessToken: 'token123',
          userInfo: {
            authId: 'auth123',
            username: 'testuser',
            fullName: 'Test User'
          }
        }
      },
      headers: undefined, 
      url: '',   // Because using Observales <HttpResponse> reditt
    });
  
    // Mock the loginUser method to return an observable of HttpResponse
    mockApiDataService.loginUser.and.returnValue(of(mockResponse));
  
    // Set the form values
    component.loginForm.setValue({ username: 'testuser', password: 'password' });
    component.onSubmit();
  
    // Expectations
    expect(mockApiDataService.loginUser).toHaveBeenCalled();
    expect(mockCookieService.setTokenCookie).toHaveBeenCalledWith('token123');
    expect(mockStore.dispatch).toHaveBeenCalledWith(A_userLoggedin({ isLoggedIn: true }));
    expect(mockStore.dispatch).toHaveBeenCalledWith(A_setUserInfo({
      userInfo: {
        authId: 'auth123',
        userName: 'testuser',
        fullName: 'Test User'
      }
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/chatapp']);
  });


  xit('should handle login error and reset form', () => {
    mockApiDataService.loginUser.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.loginForm.setValue({ username: 'testuser', password: 'password' });
    component.onSubmit();

    expect(component.invalidUser).toBeTrue();
    expect(component.loginForm.value.username).toBe(null);
    expect(component.loginForm.value.password).toBe(null);
  });
});
