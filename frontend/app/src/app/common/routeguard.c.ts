import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CustomCookieService } from "../service/cookie/cookie.service";

export const AuthRouteGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cookieService = inject(CustomCookieService);
    // TO DO: Get from State and Cookie service
    const authenticated : boolean = cookieService.hasTokenCookie();

    if (authenticated) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
}