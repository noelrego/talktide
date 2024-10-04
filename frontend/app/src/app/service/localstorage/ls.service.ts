import { Injectable } from "@angular/core";
import { LocalStrgNames, UserInfoType, UserStatus } from "../../common";

@Injectable({
    providedIn: 'root'
})
export class LocalStrgService {

    constructor () {}

    // Logged in user info
    setUserInfo(data: UserInfoType) : void {
        localStorage.setItem(LocalStrgNames.USER_INFO, JSON.stringify(data));
    }

    // Get login user info
    getUserInfo(): UserInfoType | null {
        const info = localStorage.getItem(LocalStrgNames.USER_INFO);
        if (info) {
            return JSON.parse(info);
        }
        return null;
    }

    // Set user status
    setUserStatus(status: string) : void {
        console.log('LOCAL STORAGE]: . . . ', status);
        localStorage.setItem(LocalStrgNames.USER_STATUS, status);
    }

    // Get User Status
    getUserStatus(): string {
        const status = localStorage.getItem(LocalStrgNames.USER_STATUS);
        if (status) {
            return status;
        }
        return UserStatus.AVAILABLE;
    }

    deleteIfExists(key: string) : void {
        console.log('[Localstorage] deletething :', key)
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    }

    // Delete localStorage
    deleteLocalStorage() : void {
        this.deleteIfExists(LocalStrgNames.USER_INFO);
        this.deleteIfExists(LocalStrgNames.USER_STATUS);
    }
}