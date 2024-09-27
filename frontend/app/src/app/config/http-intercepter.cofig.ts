import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpCustomInterceptor implements HttpInterceptor {
    
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // ADD JWT HEADERS
        console.log('I N T E R C E P T E R   A D D I N G  T O K E N')

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