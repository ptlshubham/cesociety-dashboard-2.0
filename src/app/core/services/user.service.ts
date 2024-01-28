import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/auth.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }
    /**
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`api/users`);
    }

    /**
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    userLogin(email: any, pass: any, id: any) {
        let data = {
            email: email,
            pass: pass,
            instituteId: id
        };
        return this.http.post(ApiService.userLoginURL, data);
    }

    adminLogin(email: any, pass: any) {
        let data = {
            email: email,
            pass: pass,
        };
        return this.http.post(ApiService.adminLoginURL, data);
    }
}
