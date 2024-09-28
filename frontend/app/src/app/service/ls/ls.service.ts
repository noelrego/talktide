import { Injectable } from "@angular/core";
import { LocalStrgNames, UserInfoType } from "../../common";

@Injectable({
    providedIn: 'root'
})
export class LocalStrgService {

    constructor () {}

    setUserInfo(data: UserInfoType) : void {
        localStorage.setItem(LocalStrgNames.USER_INFO, JSON.stringify(data));
    }

    getUserInfo(): UserInfoType | null {
        const info = localStorage.getItem(LocalStrgNames.USER_INFO);
        if (info) {
            return JSON.parse(info);
        }
        return null;
    }
}