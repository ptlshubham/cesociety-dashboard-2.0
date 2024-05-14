import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
    constructor(private http: HttpClient) { }
   
    companyLogin(email: any, pass: any) {
        let data = {
            email: email,
            pass: pass,
        };
        return this.http.post(ApiService.organizationLoginURL, data);
    }
}
