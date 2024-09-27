import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

const COOKIE_NAME = 'x-1tok90l';

@Injectable({
    providedIn: 'root'
})
export class CustomCookieService {
    
    constructor(
        private cookieService: CookieService
    ) {}


    setTokenCookie(data: string) : void {
        this.cookieService.set(COOKIE_NAME, data, {expires: 1});
    }

    hasTokenCookie() : boolean {
        return this.cookieService.check(COOKIE_NAME);
    }

    deleteCookie() : void {
        this.cookieService.deleteAll();
    }
}