import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HomeService {

    constructor(
        private http: HttpClient
    ) { }

    saveInstituteData(data: any) {
        return this.http.post(ApiService.saveInsituteDetailsURL, data);
    }
    removeInstituteList(id: any) {
        return this.http.get(ApiService.removeInstituteDetailsByIdURL + id);
    }
    updateInstituteDetails(data: any) {
        return this.http.post(ApiService.updateInstituteDetailsURL, data);
    }
    getAllInstituteData() {
        return this.http.get(ApiService.getAllInstituteDetailsURL);
    }
    saveBannersImagesData(data: any) {
        return this.http.post(ApiService.saveGalleryImagesURL, data);
    }
    uploadBannersImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadGalleryImagesURL, img);
    }
    uploadVideoImage(data: any): Observable<any> {
        
        return this.http.post<any>(ApiService.uploadGalleryVideoURL, data);
    }
    deleteInfraImage(data: any) {
        
        return this.http.post(ApiService.deleteInfraImageURL, data);
    }
    getBannersImagesById(id: any) {
        let data = {
            institute_id: id
        };
        return this.http.post(ApiService.getALLImagesByIdDetailsURL, data);
    }
    activeDeavctiveBanners(data: any): Observable<any> {
        return this.http.post<any>(ApiService.updateActiveDeactiveBannersURL, data);
    }
    activeDeavctiveNews(data: any): Observable<any> {
        return this.http.post<any>(ApiService.updateActiveDeactiveNewsURL, data);
    }
    removeBannersImagesById(id: any) {
        let data = {
            id: id
        };
        return this.http.post(ApiService.removeImagesByIdDetailsURL, data);
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
    uploadBlogImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadBlogImagesURL, img);
    }
    saveBlogDetails(data: any) {
        return this.http.post(ApiService.saveBlogDetailsURL, data);
    }
    updateBlogDetails(data: any) {
        return this.http.post(ApiService.updateBlogDetailsURL, data);
    }
    removeBlog(id: any) {
        return this.http.get(ApiService.removeBlogDetailsURL + id);
    }
    getBlogsById(id: any) {
        return this.http.get(ApiService.getBlogsDetailsByIdURL + id);
    }
    uploadOInfraImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadInfraImageURL, img);
    }
    uploadInfraMultiImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadInfraMultiImageURL, img);
    }
    getInfraMultiImageById(id: any) {
        return this.http.get(ApiService.getBlogsInfraMultiImageByIdURL + id);
    }
    saveInfrastructureDetails(data: any) {
        return this.http.post(ApiService.saveInfrastructureDetailsURL, data);
    }
    uploadMoreImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadMoreImageURL, img);
    }
    saveScholarshipDetails(data: any) {
        return this.http.post(ApiService.saveScholarshipDetailsURL, data);
    }
    getScholarshipData(id: any) {
        return this.http.get(ApiService.getScholarshipDetailsURL + id);
    }
    removeScholarshipData(id: any) {
        return this.http.get(ApiService.removeScholarshipDetailsURL + id);
    }
    saveQuestionDetails(data: any) {
        return this.http.post(ApiService.saveQuestionPapersDetailsURL, data);
    }
    getQuestionData(id: any) {
        return this.http.get(ApiService.getQuestionPapersDetailsURL + id);
    }
    removeQuestionDetails(id: any) {
        return this.http.get(ApiService.removeQuestionPapersDetailsURL + id);
    }
    updateInfraDetails(data: any) {
        return this.http.post(ApiService.updateInfraDetailsURL, data);
    }
    removeInfraById(id: any) {
        return this.http.get(ApiService.removeInfraDetailsURL + id);
    }
    getImfraDetails(id: any) {
        return this.http.get(ApiService.getInfraDetailsByIdURL + id);
    }
    getAlumniList() {
        return this.http.get(ApiService.GetAlumniDetailsURL);
    }
    getContactUsDetails(id: any) {
        return this.http.get(ApiService.getContactUsDetailsByIdURL + id);
    }
    getGatePassData() {
        return this.http.get(ApiService.getGatePassUserListURL);
    }
    saveResultData(data: any) {
        return this.http.post(ApiService.saveResultDetailsURL, data);
    }
    updateResultDetails(data: any) {
        return this.http.post(ApiService.updateResultDetailsURL, data);
    }
    removeResultDetailsById(id: any) {
        return this.http.get(ApiService.removeResultDetailsByIdURL + id);
    }
    getResultDetailsById(id: any) {
        return this.http.get(ApiService.getResultDetailsByIdURL + id);
    }
    savePdfData(data: any) {
        return this.http.post(ApiService.uploadPDFURL, data);
    }
    saveNewsListData(data: any) {
        return this.http.post(ApiService.saveNewsDataListURL, data);
    }
    getNewsDataById(institute_id: any) {
        return this.http.get(ApiService.getNewsByIdDetailsURL + institute_id);
    }
    removeNewsDataById(id: any) {
        return this.http.get(ApiService.removeNewsByIdDetailsURL + id);
    }
    saveOthersListData(data: any) {
        return this.http.post(ApiService.saveOthersDataListURL, data);
    }
    removeOtherList(id: any) {
        return this.http.get(ApiService.removeOtherDetailsByIdURL + id);
    }
    getothersDataById(institute_id: any) {
        return this.http.get(ApiService.getOthersByIdDetailsURL + institute_id);
    }
    saveStudentDetails(data: any) {
        return this.http.post(ApiService.saveStudentListDataURL, data);
    }
    updateStudentDetails(data: any) {
        return this.http.post(ApiService.updateStudentListDataURL, data);
    }
    getStudentList(id: any) {
        return this.http.get(ApiService.getStudentListDataURL + id);
    }
    removeStudentList(id: any) {
        return this.http.get(ApiService.removeStudentListDataURL + id);
    }

    saveMagazineDetails(data: any) {
        return this.http.post(ApiService.saveMagazineListURL, data);
    }
    getMagazineList() {
        return this.http.get(ApiService.getMagazineListURL);
    }
    removeMagazineList(id: any) {
        return this.http.get(ApiService.removeMagazineListURL + id);
    }
    removeNaacCrieteriaList(id: any) {
        
        return this.http.get(ApiService.removeCrietriaListURL + id);
    }
    getCounselingList() {
        return this.http.get(ApiService.getCounselingDataURL);
    }
    activeDeavctiveAnswerkey(data: any): Observable<any> {
        return this.http.post<any>(ApiService.updateActiveDeactiveAnswerkeyURL, data);
    }
    saveAnswerkeyListData(data: any) {
        return this.http.post(ApiService.saveAnswerkeyDataListURL, data);
    }
    removeAnswerkeyDataById(id: any) {
        return this.http.get(ApiService.removeAnswerkeyByIdDetailsURL + id);
    }
    removeAlumniDataById(id: any) {
        return this.http.get(ApiService.removeAlumniByIdDetailsURL + id);
    }
    getAnswerkeyDataById() {
        return this.http.get(ApiService.getAnswerkeyByIdDetailsURL);
    }
    getMicroDonation() {
        return this.http.get(ApiService.getRahatokarshDonationListURL);
    }
    saveNaacDetails(data: any): Observable<any> {
        return this.http.post(ApiService.saveNaacDetailsURL, data);
    }
    getNAACData() {
        return this.http.get(ApiService.getNaacDataURL);
    }
    getKeyNoGroup() {
        return this.http.get(ApiService.getKeyNoDataGroupByURL);
    }
    updateNAACData(data: any) {
        return this.http.post(ApiService.updateNAACDataURL, data);
    }
    saveNaacLinkDetails(data: any): Observable<any> {
        return this.http.post(ApiService.saveNaacLinkDetailsURL, data);
    }
    getSubMenuGroup(id: any) {
        return this.http.get(ApiService.getSubMenuGroupByURL + id);
    }
    getSubToSubMenuGroup(id: any) {
        return this.http.get(ApiService.getSubToSubMenuGroupByURL + id);
    }
    getNaacLinkDetails(id: any) {
        
        return this.http.get(ApiService.getNaacLinkDataURL + id);
    }
    removeNaacLink(id: any) {
        return this.http.get(ApiService.removeLinkByIDURL + id);
    }

    getCommeteeDetails(id: any) {
        return this.http.get(ApiService.getCommitteeDetailsByIdURL + id);
    }
    saveCommeeteDetails(data: any) {
        return this.http.post(ApiService.saveCommitteeDetailsURL, data);
    }
    updateCommiteeDetails(data: any) {
        return this.http.post(ApiService.updateCommitteeDetailsURL, data);
    }
    getCommiteeMultiImageById(id: any) {
        return this.http.get(ApiService.getCommitteeMultiImagesByIdURL + id);
    }
    removeCommiteeById(id: any) {
        return this.http.get(ApiService.removeCommitteeDetailsURL + id);
    }
    uploadCommitteeImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadCommitteeImageURL, img);
    }
    uploadCommitteeMultiImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadCommMultiImageURL, img);
    }
    deleteCommiImage(data: any) {
        
        return this.http.post(ApiService.deleteCommitteeImageURL, data);
    }




    getPlacementDetails(id: any) {
        return this.http.get(ApiService.getPlacementDetailsByIdURL + id);
    }
    savePlacementDetails(data: any) {
        return this.http.post(ApiService.savePlacementDetailsURL, data);
    }
    updatePlacementDetails(data: any) {
        return this.http.post(ApiService.updatePlacementDetailsURL, data);
    }
    getPlacementMultiImageById(id: any) {
        return this.http.get(ApiService.getPlacementMultiImagesByIdURL + id);
    }
    removePlacementById(id: any) {
        return this.http.get(ApiService.removePlacementDetailsURL + id);
    }
    uploadPlacementImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadPlacementImageURL, img);
    }
    uploadPlacementMultiImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadPlacementMultiImageURL, img);
    }
    deletePlacementImage(data: any) {
        return this.http.post(ApiService.deletePlacementImageURL, data);
    }


    getCampusDetails(id: any) {
        return this.http.get(ApiService.getCampusDetailsByIdURL + id);
    }
    saveCampusDetails(data: any) {
        return this.http.post(ApiService.saveCampusDetailsURL, data);
    }
    updateCampusDetails(data: any) {
        return this.http.post(ApiService.updateCampusDetailsURL, data);
    }
    getCampusMultiImageById(id: any) {
        return this.http.get(ApiService.getCampusMultiImagesByIdURL + id);
    }
    removeCampusById(id: any) {
        return this.http.get(ApiService.removeCampusDetailsURL + id);
    }
    uploadCampusImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadCampusImageURL, img);
    }
    uploadCampusMultiImage(img: any): Observable<any> {
        return this.http.post<any>(ApiService.uploadCampusMultiImageURL, img);
    }
    deleteCapusImage(data: any) {
        return this.http.post(ApiService.deleteCampusImageURL, data);
    }
    getResearchDetails(id: any) {
        return this.http.get(ApiService.getResearchDetailsByIdURL + id);
    }
    saveResearchDetails(data: any) {
        return this.http.post(ApiService.saveResearchDetailsURL, data);
    }
    updateResearchDetails(data: any) {
        return this.http.post(ApiService.updateResearchDetailsURL, data);
    }
    removeResearchById(id: any) {
        return this.http.get(ApiService.removeResearchDetailsURL + id);
    }

    getSyllabusDetails(id: any) {
        return this.http.get(ApiService.getSyllabusDetailsByIdURL + id);
    }
    saveSyllabusDetails(data: any) {
        return this.http.post(ApiService.saveSyllabusDetailsURL, data);
    }
    updateSyllabusDetails(data: any) {
        return this.http.post(ApiService.updateSyllabusDetailsURL, data);
    }
    removeSyllabusById(id: any) {
        return this.http.get(ApiService.removeSyllabusDetailsURL + id);
    }

    SaveNewNaacDetails(data: any) {
        return this.http.post(ApiService.SaveNewNaacDetailsURL, data);
    }
    UpdateNewNaacDetails(data: any) {
        return this.http.post(ApiService.UpdateNewNaacDetailsURL, data);
    }
    getNewNaacDetails(id: any) {
        return this.http.get(ApiService.GetNewNaacDetailsByIdURL + id);
    }
    removeNewNaacById(id: any) {
        return this.http.get(ApiService.removeNewNaacDetailsURL + id);
    }

    getPhotoContestData() {
        return this.http.get<any>(ApiService.getPhotoContestListURL);
    }
    getContestImages(id: any) {
        return this.http.get(ApiService.getPhotoContestImagesByIdURL + id);
    }
    removeContestDetails(id: any) {
        return this.http.get(ApiService.removePhotoContestDetailsById + id);
    }
    downloadImage(url: string): Observable<Blob> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(response => new Blob([response]))
        );
    }
    getAdmissionList(id: any) {
        return this.http.get(ApiService.getAdmissionListDataURL + id);
    }
    SaveAdmissionDetails(data: any) {
        return this.http.post(ApiService.saveAdmissionDetailsURL, data);
    }
}