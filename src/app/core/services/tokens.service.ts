import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokensService {
    constructor(
        private httpClient: HttpClient
    ) { }
    uploadRefrenceImage(img: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.uploadRefrenceImageURL, img);
    }
    RemoveRefrenceMultiImage(id: any) {
        let bnr = {
            id: id
        }
        return this.httpClient.post<any>(ApiService.removeRefrenceMultiImageURL, bnr);
    }
    SavePromotiondetails(admin: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.savePromotiondetailsURL, admin);
    }
    UploadMultiRefrence(img: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.uploadMultiRefrenceURL, img);
    }
    deleteInfraImage(data: any) {

        return this.httpClient.post(ApiService.deleteInfraImageURL, data);
    }
}