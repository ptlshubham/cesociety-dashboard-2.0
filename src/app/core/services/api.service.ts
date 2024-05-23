import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static HOST_URL: string = "http://localhost:9000";
  // public static HOST_URL: string = "https://api.cesociety.in";

  constructor(
  ) { }
  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //authenticate

  public static userLoginURL: string = ApiService.HOST_URL + '/authenticate/UserLogin';
  public static adminLoginURL: string = ApiService.HOST_URL + '/authenticate/AdminLogin';
  public static organizationLoginURL: string = ApiService.HOST_URL + '/authenticate/OrganizationLogin';

  // admin

  public static saveInsituteDetailsURL: string = ApiService.HOST_URL + '/admin/SaveInsituteDetails';
  public static removeInstituteDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveInstituteDetailsById/';
  public static updateInstituteDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateInstituteDetails';
  public static getAllInstituteDetailsURL: string = ApiService.HOST_URL + '/admin/GetAllInstituteDetails';
  public static saveGalleryImagesURL: string = ApiService.HOST_URL + '/admin/SaveGalleryImages';
  public static uploadGalleryImagesURL: string = ApiService.HOST_URL + '/admin/UploadGalleryImages';
  public static uploadGalleryVideoURL: string = ApiService.HOST_URL + '/admin/UploadGalleryVideo';
  public static getImagesByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetImagesByIdDetails';
  public static deleteInfraImageURL: string = ApiService.HOST_URL + '/admin/deleteInfraImage';
  public static getALLImagesByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetALLImagesByIdDetails';
  public static updateActiveDeactiveBannersURL: string = ApiService.HOST_URL + '/admin/UpdateActiveDeactiveBanners';
  public static updateActiveDeactiveNewsURL: string = ApiService.HOST_URL + '/admin/UpdateActiveDeactiveNews'
  public static removeImagesByIdDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveImagesByIdDetails';
  public static uploadDepartmentImageURL: string = ApiService.HOST_URL + '/admin/UploadDepartmentImage';
  public static uploadDepartmentMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadDepartmentMultiImage';
  public static deleteDepartmentImageURL: string = ApiService.HOST_URL + '/admin/DeleteDepartmentImage';
  public static getDepMultiImageByIdURL: string = ApiService.HOST_URL + '/admin/GetDepMultiImageById/';
  public static saveDepartmentListURL: string = ApiService.HOST_URL + '/admin/SaveDepartmentList';
  public static getDepartmentByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetDepartmentByIdDetails/';
  public static removeDepartmentByIdDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveDepartmentByIdDetails/';
  public static updateDepartmentListURL: string = ApiService.HOST_URL + '/admin/UpdateDepartmentList';
  public static saveStaffProfileImagesURL: string = ApiService.HOST_URL + '/admin/SaveStaffProfileImages';
  public static saveStaffDetailsListURL: string = ApiService.HOST_URL + '/admin/SaveStaffDetailsList';
  public static updateStaffDetailsByIdURL: string = ApiService.HOST_URL + '/admin/UpdateStaffDetailsById';
  public static removeStaffDocumentURL: string = ApiService.HOST_URL + '/admin/RemoveStaffDocument/';
  public static getAllStaffDetailsURL: string = ApiService.HOST_URL + '/admin/GetAllStaffDetails/';
  public static removeStaffDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveStaffDetailsById/';
  public static saveDonnerListDetailsURL: string = ApiService.HOST_URL + '/admin/SaveDonnerListDetails';
  public static getAllDonnerListURL: string = ApiService.HOST_URL + '/admin/GetAllDonnerList';
  public static removeDonnerDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveDonnerDetailsById/';
  public static getBeneficiaryYearURL: string = ApiService.HOST_URL + '/admin/GetBeneficiaryYear';
  public static saveBeneficiaryDetailsURL: string = ApiService.HOST_URL + '/admin/SaveBeneficiaryDetails';
  public static updateBeneficiaryDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateBeneficiaryDetails';
  public static getAllBeneficiaryListURL: string = ApiService.HOST_URL + '/admin/GetAllBeneficiaryList';
  public static removeBeneficiaryDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveBeneficiaryDetailsById/';
  public static saveBulkBeneficiaryDetailsURL: string = ApiService.HOST_URL + '/admin/SaveBulkBeneficiaryDetails';
  public static saveBulkDonnersDetailsURL: string = ApiService.HOST_URL + '/admin/SaveBulkDonnersDetails';
  public static saveBlogDetailsURL: string = ApiService.HOST_URL + '/admin/SaveBlogDetails';
  public static updateBlogDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateBlogDetails';
  public static getBlogsDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetBlogsDetailsById/'
  public static removeBlogDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveBlogDetails/';
  public static uploadBlogImagesURL: string = ApiService.HOST_URL + '/admin/uploadBlogImages';
  public static uploadInfraImageURL: string = ApiService.HOST_URL + '/admin/UploadInfraImage';
  public static uploadInfraMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadInfraMultiImage';
  public static saveInfrastructureDetailsURL: string = ApiService.HOST_URL + '/admin/SaveInfrastructureDetails';
  public static getBlogsInfraMultiImageByIdURL: string = ApiService.HOST_URL + '/admin/GetInfraMultiImagesById/';
  public static updateInfraDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateInfraDetails';
  public static removeInfraDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveInfraDetails/';
  public static getInfraDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetInfraDetailsById/';
  public static SaveAlumniDetailsURL: string = ApiService.HOST_URL + '/admin/SaveAlumniDetails';
  public static GetAlumniDetailsURL: string = ApiService.HOST_URL + '/admin/GetAlumniDetails';
  public static getContactUsDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetContactUsDetailsById/';
  public static saveResultDetailsURL: string = ApiService.HOST_URL + '/admin/SaveResultDetails';
  public static updateResultDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateResultDetails';
  public static removeResultDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveResultDetailsById/';
  public static getResultDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetResultDetailsById/';
  public static uploadPDFURL: string = ApiService.HOST_URL + '/admin/UploadPDF';
  public static saveNewsDataListURL: string = ApiService.HOST_URL + '/admin/SaveNewsDataList';
  public static getNewsByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetNewsByIdDetails/';
  public static removeNewsByIdDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveNewsByIdDetails/';
  public static saveOthersDataListURL: string = ApiService.HOST_URL + '/admin/SaveOthersDataList';
  public static removeOtherDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveOtherDetailsById/'
  public static getOthersByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetOthersByIdDetails/';
  public static saveStudentListDataURL: string = ApiService.HOST_URL + '/admin/SaveStudentListData';
  public static updateStudentListDataURL: string = ApiService.HOST_URL + '/admin/UpdateStudentListData';
  public static removeStudentListDataURL: string = ApiService.HOST_URL + '/admin/RemoveStudentListData/';
  public static getStudentListDataURL: string = ApiService.HOST_URL + '/admin/GetStudentListData/';
  public static saveMagazineListURL: string = ApiService.HOST_URL + '/admin/SaveMagazineList';
  public static removeMagazineListURL: string = ApiService.HOST_URL + '/admin/RemoveMagazineList/';
  public static removeCrietriaListURL: string = ApiService.HOST_URL + '/admin/RemoveCrietriaListURL/';
  public static getMagazineListURL: string = ApiService.HOST_URL + '/admin/GetMagazineList';
  public static getCounselingDataURL: string = ApiService.HOST_URL + '/admin/GetCounselingData';
  public static getRahatokarshDonationListURL: string = ApiService.HOST_URL + '/admin/GetRahatokarshDonationList';
  // public static generateRahatokarshCertficateURL: string = ApiService.HOST_URL + '/admin/GenerateRahatokarshCertficate';
  public static uploadMoreImageURL: string = ApiService.HOST_URL + '/admin/UploadMoreImage';
  public static saveScholarshipDetailsURL: string = ApiService.HOST_URL + '/admin/SaveScholarshipDetails';
  public static getScholarshipDetailsURL: string = ApiService.HOST_URL + '/admin/GetScholarshipDetails/';
  public static removeScholarshipDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveScholarshipDetails/';
  public static saveQuestionPapersDetailsURL: string = ApiService.HOST_URL + '/admin/SaveQuestionPapersDetails';
  public static getQuestionPapersDetailsURL: string = ApiService.HOST_URL + '/admin/GetQuestionPapersDetails/';
  public static removeQuestionPapersDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveQuestionPapersDetails/';
  public static saveGatePassUserListURL: string = ApiService.HOST_URL + '/admin/SaveGatePassUserList';
  public static getGatePassUserListURL: string = ApiService.HOST_URL + '/admin/GetGatePassUserList';
  public static updateActiveDeactiveAnswerkeyURL: string = ApiService.HOST_URL + '/admin/UpdateActiveDeactiveAnswerkey';
  public static saveAnswerkeyDataListURL: string = ApiService.HOST_URL + '/admin/SaveAnswerkeyDataList';
  public static getAnswerkeyByIdDetailsURL: string = ApiService.HOST_URL + '/admin/GetAllAnswerkey';
  public static removeAnswerkeyByIdDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveAnswerkeyByIdDetails/';
  public static removeAlumniByIdDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveAlumniByIdDetails/';
  public static saveNaacDetailsURL: string = ApiService.HOST_URL + '/admin/SaveNaacDetails';
  public static getNaacDataURL: string = ApiService.HOST_URL + '/admin/GetNaacData';
  public static getKeyNoDataGroupByURL: string = ApiService.HOST_URL + '/admin/GetKeyNoDataGroupBy';
  public static updateNAACDataURL: string = ApiService.HOST_URL + '/admin/UpdateNAACData';
  public static getNaacLinkDataURL: string = ApiService.HOST_URL + '/admin/GetNaacLinkData/';
  public static getSubMenuGroupByURL: string = ApiService.HOST_URL + '/admin/GetSubMenuGroupBy/';
  public static getSubToSubMenuGroupByURL: string = ApiService.HOST_URL + '/admin/GetSubToSubMenuGroupBy/';
  public static saveNaacLinkDetailsURL: string = ApiService.HOST_URL + '/admin/SaveNaacLinkDetails';
  public static removeLinkByIDURL: string = ApiService.HOST_URL + '/admin/RemoveLinkByID/';

  public static uploadCommitteeImageURL: string = ApiService.HOST_URL + '/admin/UploadCommitteeImage';
  public static uploadCommMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadCommMultiImage';
  public static saveCommitteeDetailsURL: string = ApiService.HOST_URL + '/admin/SaveCommitteeDetails';
  public static getCommitteeMultiImagesByIdURL: string = ApiService.HOST_URL + '/admin/GetCommitteeMultiImagesById/';
  public static updateCommitteeDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateCommitteeDetails';
  public static removeCommitteeDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveCommitteeDetails/';
  public static getCommitteeDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetCommitteeDetailsById/';
  public static deleteCommitteeImageURL: string = ApiService.HOST_URL + '/admin/deleteCommitteeImage';

  //PLACEMENT
  public static getPlacementDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetPlacementDetailsById/';
  public static getPlacementMultiImagesByIdURL: string = ApiService.HOST_URL + '/admin/GetPlacementMultiImagesById/';
  public static deletePlacementImageURL: string = ApiService.HOST_URL + '/admin/deletePlacementImage';
  public static removePlacementDetailsURL: string = ApiService.HOST_URL + '/admin/RemovePlacementDetails/';
  public static uploadPlacementImageURL: string = ApiService.HOST_URL + '/admin/UploadPlacementImage';
  public static uploadPlacementMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadPlacementMultiImage';
  public static updatePlacementDetailsURL: string = ApiService.HOST_URL + '/admin/UpdatePlacementDetails';
  public static savePlacementDetailsURL: string = ApiService.HOST_URL + '/admin/SavePlacementDetails';

  //CAMPUS LIFE
  public static getCampusDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetCampusDetailsById/';
  public static getCampusMultiImagesByIdURL: string = ApiService.HOST_URL + '/admin/GetCampusMultiImagesById/';
  public static deleteCampusImageURL: string = ApiService.HOST_URL + '/admin/deleteCampusImage';
  public static removeCampusDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveCampusDetails/';
  public static uploadCampusImageURL: string = ApiService.HOST_URL + '/admin/UploadCampusImage';
  public static uploadCampusMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadCampusMultiImage';
  public static updateCampusDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateCampusDetails';
  public static saveCampusDetailsURL: string = ApiService.HOST_URL + '/admin/SaveCampusDetails';

  //RESEARCH
  public static getResearchDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetResearchDetailsById/';
  public static removeResearchDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveResearchDetails/';
  public static updateResearchDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateResearchDetails';
  public static saveResearchDetailsURL: string = ApiService.HOST_URL + '/admin/SaveResearchDetails';

  //Syllabus
  public static getSyllabusDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetSyllabusDetailsById/';
  public static removeSyllabusDetailsURL: string = ApiService.HOST_URL + '/admin/RemoveSyllabusDetails/';
  public static updateSyllabusDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateSyllabusDetails';
  public static saveSyllabusDetailsURL: string = ApiService.HOST_URL + '/admin/SaveSyllabusDetails';

  public static SaveNewNaacDetailsURL: string = ApiService.HOST_URL + '/admin/SaveNewNaacDetails';
  public static UpdateNewNaacDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateNewNaacDetails';
  public static GetNewNaacDetailsByIdURL: string = ApiService.HOST_URL + '/admin/GetNewNaacDetailsById/';
  public static removeNewNaacDetailsURL: string = ApiService.HOST_URL + '/admin/removeNewNaacDetails/';

  public static getPhotoContestListURL: string = ApiService.HOST_URL + '/admin/GetPhotoContestList';
  public static getPhotoContestImagesByIdURL: string = ApiService.HOST_URL + '/admin/GetPhotoContestImagesById/';
  public static removePhotoContestDetailsById: string = ApiService.HOST_URL + '/admin/RemovePhotoContestDetailsById/';

  public static saveAdmissionDetailsURL: string = ApiService.HOST_URL + '/admin/SaveAdmissionDetails';
  public static getAdmissionListDataURL: string = ApiService.HOST_URL + '/admin/GetAdmissionListData/';


  // Company APIS
  public static saveEmployeeProfileImagesURL: string = ApiService.HOST_URL + '/admin/SaveEmployeeProfileImages';
  public static saveEmployeeDetailsListURL: string = ApiService.HOST_URL + '/admin/SaveEmployeeDetailsList';
  public static updateEmployeeDetailsByIdURL: string = ApiService.HOST_URL + '/admin/UpdateEmployeeDetailsById';
  public static getAllEmployeeDetailsURL: string = ApiService.HOST_URL + '/admin/GetAllEmployeeDetails';
  public static getEmployeeDetailsURL: string = ApiService.HOST_URL + '/admin/GetEmployeeDetails';
  public static removeEmployeeDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveEmployeeDetailsById';

  public static SaveClientImageURL: string = ApiService.HOST_URL + '/admin/SaveClientImage';
  public static SaveClientDetailsURL: string = ApiService.HOST_URL + '/admin/SaveClientDetails';
  public static getAllClientDetailsURL: string = ApiService.HOST_URL + '/admin/GetAllClientDetails';
  public static removeClientDetailsByIdURL: string = ApiService.HOST_URL + '/admin/RemoveClientDetailsById/';
  public static getAssignedEmployeeDetailsURL: string = ApiService.HOST_URL + '/admin/GetAssignedEmployeeDetails/';

  public static uploadTokenImageURL: string = ApiService.HOST_URL + '/admin/UploadTokenImage';
  public static uploadTokenMultiImageURL: string = ApiService.HOST_URL + '/admin/UploadTokenMultiImage';
  public static removeRefrenceMultiImageURL: string = ApiService.HOST_URL + '/admin/RemoveRefrenceImage';
  public static saveTokenDetailsListURL: string = ApiService.HOST_URL + '/admin/SaveTokenDetailsList';
  public static getALLTokenDetailsURL: string = ApiService.HOST_URL + '/admin/GetALLTokenDetails';
  public static updateTokenUnreadStatusURL: string = ApiService.HOST_URL + '/admin/UpdateTokenUnreadStatus/';
  public static getALLTokenImageURL: string = ApiService.HOST_URL + '/admin/GetALLTokenImage/';

  public static getEmployeeTokenByIdURL: string = ApiService.HOST_URL + '/admin/GetEmployeeTokenById/';
  public static updateTokenStatusDetailsURL: string = ApiService.HOST_URL + '/admin/UpdateTokenStatusDetails';
  public static getAssignedEmpTokenByIdURL: string = ApiService.HOST_URL + '/admin/GetAssignedEmpTokenById/';
  public static ChackForPasswordURL: string = ApiService.HOST_URL + '/admin/ChackForPassword';
  public static updatePasswordURL: string = ApiService.HOST_URL + '/admin/UpdateCompanyPassword';
  public static getEmployeeDataByIdURL: string = ApiService.HOST_URL + '/admin/getEmployeeDataById/';

  public static SaveAttendanceDetailsURL: string = ApiService.HOST_URL + '/admin/SaveAttendanceDetails';
  public static getAllAttendanceListURL: string = ApiService.HOST_URL + '/admin/GetAllAttendanceList';









  //Cashfree APIS
  public static createCashfreeOrderURL: string = ApiService.HOST_URL + '/cashfree/createCashfreeOrder';





}
