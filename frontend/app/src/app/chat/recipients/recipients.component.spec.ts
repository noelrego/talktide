// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { RecipientsComponent } from './recipients.component';

// describe('RecipientsComponent', () => {
//   let component: RecipientsComponent;
//   let fixture: ComponentFixture<RecipientsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [RecipientsComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(RecipientsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   xit('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { RecipientsComponent } from './recipients.component';
import { SocketService } from '../socket/socket.service';
import { ApiDataService } from '../../service/api';
import { HttpResponse } from '@angular/common/http';
import { AvailableUserType, MemberListType } from '../../common';
import { A_insertAvailableUserList, A_insertMembers } from '../../STORE';

// mock it

describe('RecipientsComponent', () => {
  let component: RecipientsComponent;
  let fixture: ComponentFixture<RecipientsComponent>;
  let mockStore: any;
  let mockSocketService: any;
  let mockApiDataService: any;

  beforeEach(async () => {
    // Mock for NGRX Store
    mockStore = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of([]))
    };

    // Mock for SocketService
    mockSocketService = {
      socketConnected: false,
      connectSocket: jasmine.createSpy('connectSocket'),
      onEvent: jasmine.createSpy('onEvent').and.returnValue(of({})),
      emit: jasmine.createSpy('emit'),
    };



    // Mock for ApiDataService
    mockApiDataService = {
      getmemberList: jasmine.createSpy('getmemberList').and.returnValue(of(new HttpResponse({
        body: {
          resData: { memberInfo: [] }
        },
        status: 200,
        statusText: 'OK'
      }))),
      getAvailableUserList: jasmine.createSpy('getAvailableUserList').and.returnValue(of(new HttpResponse({
        body: {
          resData: []
        },
        status: 200,
        statusText: 'OK'
      }))),
      getChatHistory: jasmine.createSpy('getChatHistory').and.returnValue(of(new HttpResponse({
        body: {
          resData: []
        },
        status: 200,
        statusText: 'OK'
      }))),
    };

    await TestBed.configureTestingModule({
      declarations: [RecipientsComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: SocketService, useValue: mockSocketService },
        { provide: ApiDataService, useValue: mockApiDataService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should connect to socket on init if not connected', () => {
    component.ngOnInit();
    expect(mockSocketService.connectSocket).toHaveBeenCalled();
  });


  it('should subscribe to socket events and update state accordingly', () => {
    component.ngOnInit();
    expect(mockSocketService.onEvent).toHaveBeenCalledWith('SOMEONE_LOGGEDIN');
    expect(mockSocketService.onEvent).toHaveBeenCalledWith('SOMEONE_LOGGEDOUT');
    expect(mockSocketService.onEvent).toHaveBeenCalledWith('CREATED_CHAT_MEMBER');
    expect(mockSocketService.onEvent).toHaveBeenCalledWith('USER_CHANGED_STATUS');
  });


  it('should unsubscribe from socket events on destroy', () => {

    spyOn(component.socketSomeoneLoggedIn$, 'unsubscribe');
    spyOn(component.socketSomeoneLoggedOut$, 'unsubscribe');
    spyOn(component.socketCreatedChatMemberSelf$, 'unsubscribe');
    spyOn(component.sockerUserChangedStatus$, 'unsubscribe');
    spyOn(component.socketChatNotification$, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.socketSomeoneLoggedIn$.unsubscribe).toHaveBeenCalled();
    expect(component.socketSomeoneLoggedOut$.unsubscribe).toHaveBeenCalled();
    expect(component.socketCreatedChatMemberSelf$.unsubscribe).toHaveBeenCalled();
    expect(component.sockerUserChangedStatus$.unsubscribe).toHaveBeenCalled();
    expect(component.socketChatNotification$.unsubscribe).toHaveBeenCalled();

  });
});
