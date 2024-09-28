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


    // Demo purpose
    setTokenCookie(data: string) : void {
        let ex = new Date();
        let extend = ex.getHours() + 2;
        ex.setHours(extend);
        this.cookieService.set(COOKIE_NAME, data, {expires: ex});
    }

    hasTokenCookie() : boolean {
        return this.cookieService.check(COOKIE_NAME);
    }

    deleteCookie() : void {
        this.cookieService.deleteAll();
    }
}