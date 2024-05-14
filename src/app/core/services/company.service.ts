import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(
        private http: HttpClient
    ) { }

    saveEmployeeProfileImages(data: any) {
        return this.http.post(ApiService.saveEmployeeProfileImagesURL, data);
    }
    saveEmployeeDetails(data: any) {
        return this.http.post(ApiService.saveEmployeeDetailsListURL, data);
    }
    updaetEmployeeDetails(data: any) {
        return this.http.post(ApiService.updateEmployeeDetailsByIdURL, data);
    }
    getAllEmployeeDetailsData(id: any) {
        return this.http.get(ApiService.getAllEmployeeDetailsURL + id);
    }
    removeEmployeeDetailsById(id: any) {
        return this.http.get(ApiService.removeEmployeeDetailsByIdURL + id);
    }

}