import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-campus-life',
  templateUrl: './campus-life.component.html',
  styleUrls: ['./campus-life.component.scss']
})
export class CampusLifeComponent implements OnInit {
  public Editor = ClassicEditor;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  campusImages:any;
  campusMultiImage: any = [];
  campusData:any=[];
  campusModel:any={};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  addMultiImg: any = [];
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  campusMulti: any = [];
  multiImage: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.val++;
    this.getcampusDataById();
  }
  openAddCampus() {
    this.campusModel = {};
    this.addMultiImg = [];
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddCampus() {
    this.isOpen = false;
    this.isUpdate = false;
  }
  uploadFile(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          if (image.width === 500 && image.height === 500) {
            this.imageUrl = reader.result;
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.homeService.uploadCampusImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.campusImages = response;
              this.editFile = false;
              this.removeUpload = true;
            });
          } else {
            this.toastr.error('Please upload an image with dimensions of 500x500px', 'Invalid Dimension', { timeOut: 3000, });
          }
        };
      };
    }
  }
  removeUploadedImage() {
    // console.log(this.campusImages);
    let data ={
      img :this.campusImages
    };
    this.homeService.deleteCapusImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.campusImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  saveCampusDetails() {
    this.campusModel.institute_id = localStorage.getItem('InstituteId');
    this.campusModel.campusImage = this.campusImages;
    this.campusModel.campusMultiImage = this.campusMultiImage;
    this.homeService.saveCampusDetails(this.campusModel).subscribe((res: any) => {
      this.campusData = res;
      this.campusModel.campusImage = null;
      this.campusImages = null;
      this.campusModel.campusMultiImage=[];
      this.campusMultiImage=[];
      this.toastr.success('Campus Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getcampusDataById();
    })
  }
  addServiceList() {
    this.val++;
    this.addMultiImg.push(
      {
        name: this.val,
        multiImageUrl: 'assets/images/file-upload-image.jpg'
      }
    );
  }
  uploadMultiFile(event: any, ind: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          if (image.width === 500 && image.height === 500) {
            this.addMultiImg[ind].multiImageUrl = reader.result;
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.homeService.uploadCampusMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.campusMultiImage.push(response);
              this.addMultiImg[ind].multiImageUrl ='https://api.cesociety.in' + response;
              this.editFile = false;
              this.removeUpload = true;
            });
          } else {
            this.toastr.error('Please upload an image with dimensions of 500x500px', 'Invalid Dimension', { timeOut: 3000, });
          }
        };
      };
    }
  }
  removeServiceList(val: any) {
    let data ={
      img :this.addMultiImg[val].multiImageUrl
    };
    this.homeService.deletePlacementImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.addMultiImg.splice(val, 1);
  }
  editCampusDetails(data: any) {
    this.campusModel = data;
    this.getCampusMultiImage(data.id);
    this.imageUrl = 'https://api.cesociety.in' + data.campusImage
    debugger
    this.isOpen = true;
    this.isUpdate = true;
  }
  getCampusMultiImage(id: any) {
    this.multiImage = [];
    this.homeService.getCampusMultiImageById(id).subscribe((res: any) => {
      this.campusMulti = res;
      if (this.campusMulti.length > 0) {
        this.campusMulti.forEach((element: any,ind:any) => {
          this.multiImage.push({ name: ind+1, multiImageUrl: 'https://api.cesociety.in' + element.image });
        });
      }
      this.addMultiImg = this.multiImage;
    })
  }
  updateCampusDetails() {
    if (this.campusImages != null || undefined) {
      this.campusModel.campusImage = this.campusImages;
    }
    this.homeService.updateCampusDetails(this.campusModel).subscribe((res: any) => {
      this.campusData = res;
      this.toastr.success('Campus Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getcampusDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removeCampusById(id: any) {
    this.homeService.removeCampusById(id).subscribe((res: any) => {
      this.campusData = res;
      this.toastr.success('Campus Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getcampusDataById();
    })
  }
  getcampusDataById() {
    this.homeService.getCampusDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.campusData = res;
      debugger
      for (let i = 0; i < this.campusData.length; i++) {
        this.campusData[i].index = i + 1;
      }
      this.collectionSize = this.campusData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.campusData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewCampusDetails(id: any) {
    this.router.navigate(['/campus-details', id]);
  }

}
