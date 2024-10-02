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

  constructor(private myCookie: CustomCookieService) {

    console.log(' SOME ONE CALLED MEEE... I AM INITIALTING');
    this.connectSocket();
  }

  private connectSocket(): void {
    const socketUrl = ENVS.WEBSOCKRT_URL;
    console.log('SOCKET URI: ', socketUrl);

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
      console.log('Socket connected');
    });

    // Handle connection errors
    this.socket.on('connect_error', (error: any) => {
      console.error('Connection failed:', error);
    });

    // Handle disconnection
    this.socket.on('disconnect', (reason: string) => {
      console.warn(`Socket disconnected: ${reason}`);

      if (reason === 'io server disconnect') {
        // Manually reconnect if the server disconnected the client
        this.socket.connect();
      }
    });

    // Handle reconnection attempts
    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`Reconnection attempt #${attemptNumber}`);
    });

    // Handle successful reconnection
    this.socket.on('reconnect', () => {
      console.log('Socket reconnected');
    });

    // Handle reconnection failure after all attempts
    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
    });
  }

  // Generic: Listen for specific events
  onEvent(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  // Generic: Emit events to the server
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Clean up the socket connection
  disconnect(): void {
    this.socket.disconnect();
  }

}
