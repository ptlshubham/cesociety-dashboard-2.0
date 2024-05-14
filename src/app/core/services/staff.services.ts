import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StaffService {
    constructor(
        private http: HttpClient
    ) { }

    saveStaffProfileImages(data: any) {
        return this.http.post(ApiService.saveStaffProfileImagesURL, data);
    }
    saveStaffDetails(data: any) {
        return this.http.post(ApiService.saveStaffDetailsListURL, data);
    }
    updaetStaffDetails(data: any) {
        return this.http.post(ApiService.updateStaffDetailsByIdURL, data);
    }
    removeStaffPaper(id: any) {
        return this.http.get(ApiService.removeStaffDocumentURL + id);
    }
    getAllStaffDetailsData(id: any) {
        return this.http.get(ApiService.getAllStaffDetailsURL + id);
    }
    removeStaffDetailsById(id: any) {
        return this.http.get(ApiService.removeStaffDetailsByIdURL + id);
    }

    uploadBannersImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadGalleryImagesURL, img);
    }
    getBannersImagesById(id: any) {
        let data = {
            institute_id: id
        };
        return this.http.post(ApiService.getImagesByIdDetailsURL, data);
    }
    activeDeavctiveBanners(data: any): Observable<any> {
        return this.http.post<any>(ApiService.updateActiveDeactiveBannersURL, data);
    }

    saveDepartmentListData(data: any) {

        return this.http.post(ApiService.saveDepartmentListURL, data);
    }
    getDepartmentDataById(institute_id: any) {
        return this.http.get(ApiService.getDepartmentByIdDetailsURL + institute_id);
    }
    removeDepartmentDataById(institute_id: any) {
        return this.http.get(ApiService.removeDepartmentByIdDetailsURL + institute_id);
    }
    updateDepartmentListData(data: any) {

        return this.http.post(ApiService.updateDepartmentListURL, data);
    }
}