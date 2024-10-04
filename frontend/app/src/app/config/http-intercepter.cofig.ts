import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { API_ENDPOINT } from "../common";
import { CustomCookieService } from "../service/cookie";

@Injectable({
    providedIn: 'root'
})
export class HttpCustomInterceptor implements HttpInterceptor {
    
    constructor(
        private router: Router,
        private myCookie: CustomCookieService
    ) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    

        // Exclude for some API
        if (req.url.includes(API_ENDPOINT.LOGIN) || req.url.includes(API_ENDPOINT.REGISTER) || req.url.includes(API_ENDPOINT.CHECK_USER)) {
            return next.handle(req);
        } else {
            const token = this.myCookie.getTokenCookie();

            if (!token) {
                this.router.navigate(['/login']);
            }

            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return next.handle(req).pipe(
                catchError((error: HttpErrorResponse) => {
                    //  Invalid JWT Token
                    if ( error.status === 403) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(() => error); // Rethrow the error
                })
            )
        } 
    }
}