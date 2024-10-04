import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ENDPOINT, CheckUserDto, LoginUserDto, RegisterUserDto } from "../../common";

@Injectable({
    providedIn: 'root'
})
export class ApiDataService {
    constructor (
        private http: HttpClient
    ) {}


    // API to check user name exists
    checkUserName(data: string) : Observable<HttpResponse<any>> {
        return this.http.post<any>(API_ENDPOINT.CHECK_USER, 
            { userName: data }, { observe: 'response' });
    }


    // API to register user
    registerUser(data: RegisterUserDto) : Observable<HttpResponse<any>> {
        return this.http.post<any>(API_ENDPOINT.REGISTER, data, { observe: 'response' });
    }

    // API to Login
    loginUser(data: LoginUserDto) : Observable<HttpResponse<any>> {
        return this.http.post<any>(API_ENDPOINT.LOGIN, data, { observe: 'response' })
    }


    // List all users
    getAllUsers() : Observable<HttpResponse<any>> {
        return this.http.post<any>(API_ENDPOINT.CHECK_USER, { observe: 'response' })
    }


    // Get available userList
    getAvailableUserList() : Observable<HttpResponse<any>> {
        return this.http.get<any>(API_ENDPOINT.GET_AVAILABLEUSER_LIST, { observe: 'response' })
    }
} 