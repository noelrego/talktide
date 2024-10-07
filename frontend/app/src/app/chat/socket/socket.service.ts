import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { ENVS } from '../../config/environment';
import { CustomCookieService } from '../../service/cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket!: Socket;
  socketConnected: boolean = false;

  constructor(private myCookie: CustomCookieService) {
  }

  connectSocket(): void {
    const socketUrl = ENVS.WEBSOCKRT_URL;

    this.socket = io(socketUrl, {
      reconnection : true,
      reconnectionAttempts: 5,  
      reconnectionDelay: 2000,  
      timeout: 5000,
      extraHeaders: {
        Authorization: `Bearer ${this.myCookie.getTokenCookie()}`
      }       
    });

    // Handle successful connection
    this.socket.on('connect', () => {
      this.socketConnected = true;



    });

    // Handle connection errors
    this.socket.on('connect_error', (error: any) => {
      console.error('Connection failed:', error);
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason: string) => {
      this.socketConnected = false;
    });

    // Handle reconnection attempts
    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
    });

    // Handle successful reconnection
    this.socket.on('reconnect', () => {
      this.socketConnected = true;
    });

    // Handle reconnection failure after all attempts
    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      this.socketConnected = false;
    });
    
  }

  // Generic: Listen for specific events
  onEvent(event: string, time = null): Observable<any> {
      return new Observable(observer => {
        this.socket.on(event, (data: any) => {
          observer.next(data);
        });

        // On unsubscribe 
        return () => this.socket.off(event);
      });

    
    
  }

  // Generic: Emit events to the server
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Clean up the socket connection
  disconnect(): void {
    if(this.socketConnected)
      this.socket.disconnect();
  }

}
