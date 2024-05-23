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
    saveEmployeeDetails(data: any): Observable<any> {
        return this.http.post(ApiService.saveEmployeeDetailsListURL, data);
    }
    updaetEmployeeDetails(data: any) {
        return this.http.post(ApiService.updateEmployeeDetailsByIdURL, data);
    }
    getAllEmployeeDetailsData() {
        return this.http.get(ApiService.getAllEmployeeDetailsURL);
    }
    getEmployeeDetailsData(): Observable<any> {
        return this.http.get(ApiService.getEmployeeDetailsURL);
    }
    removeEmployeeDetailsById(data: any): Observable<any> {
        debugger
        return this.http.post(ApiService.removeEmployeeDetailsByIdURL, data);
    }



    SaveClientImage(data: any) {
        return this.http.post(ApiService.SaveClientImageURL, data);
    }
    SaveClientDetails(data: any): Observable<any> {
        return this.http.post(ApiService.SaveClientDetailsURL, data);
    }
    getAllClientDetailsData() {
        return this.http.get(ApiService.getAllClientDetailsURL);
    }
    removeClientDetailsById(id: any) {
        return this.http.get(ApiService.removeClientDetailsByIdURL + id);
    }
    getAssignedEmpDetailsById(id: any) {
        return this.http.get(ApiService.getAssignedEmployeeDetailsURL + id);
    }
    ChackForPassword(data: any) {
        debugger
        return this.http.post(ApiService.ChackForPasswordURL, data);
    }
    updatePassword(admin: any): Observable<any> {
        debugger
        return this.http.post<any>(ApiService.updatePasswordURL, admin);
    }
    getEmployeeDataById(id: any) {
        return this.http.get(ApiService.getEmployeeDataByIdURL + id);
    }



    SaveAttendanceDetails(data: any): Observable<any> {
        return this.http.post(ApiService.SaveAttendanceDetailsURL, data);
    }
    getAttandanceData(): Observable<any> {
        return this.http.get(ApiService.getAllAttendanceListURL);
    }
    
}