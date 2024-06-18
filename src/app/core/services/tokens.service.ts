import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokensService {
    constructor(
        private httpClient: HttpClient
    ) { }
    uploadTokenImage(img: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.uploadTokenImageURL, img);
    }
    UploadMultiToken(img: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.uploadTokenMultiImageURL, img);
    }
    RemoveRefrenceMultiImage(id: any) {
        let bnr = {
            id: id
        }
        return this.httpClient.post<any>(ApiService.removeRefrenceMultiImageURL, bnr);
    }
    SaveTokendetails(admin: any): Observable<any> {
        return this.httpClient.post<any>(ApiService.saveCESTokenDetailsURL, admin);
    }

    deleteInfraImage(data: any) {

        return this.httpClient.post(ApiService.deleteInfraImageURL, data);
    }

    getAllTokenData() {
        return this.httpClient.get(ApiService.getALLCESTokenDataURL);
    }
    getMultiTokenImageData(id: any) {
        return this.httpClient.get(ApiService.getCESTokenImageURL + id);
    }
    removeCesToken(id: any) {
        return this.httpClient.get(ApiService.removeCESTokenURL + id);
    }
    saveTokenFileData(data: any) {
        return this.httpClient.post(ApiService.uploadTokensFilesURL, data);
    }
    removeTokenFileData(id: any) {
        let data = {
            id: id
        }
        return this.httpClient.post(ApiService.deleteTokenUploadedImageURL, data);
    }

    // getTokenByEmpIdData(id: any) {
    //     return this.httpClient.get(ApiService.getEmployeeTokenByIdURL + id);
    // }
    // updateMarkAsRead(id: any) {
    //     return this.httpClient.get(ApiService.updateTokenUnreadStatusURL + id);
    // }


    // updateTokenStatus(data: any) {
    //     return this.httpClient.post(ApiService.updateTokenStatusDetailsURL, data);
    // }
    // getAssignedTokenEmp(id: any) {
    //     return this.httpClient.get(ApiService.getAssignedEmpTokenByIdURL + id);
    // }

    // updateDailyMarkAsRead(id: any) {
    //     return this.httpClient.get(ApiService.updateDailyWorkUnreadStatusURL + id);
    // }

    // updateClearNotification(data: any) {
    //     return this.httpClient.post(ApiService.updateTokenNotificationURL, data);
    // }

}