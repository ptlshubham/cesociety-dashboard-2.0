import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-infrastructure',
  templateUrl: './infrastructure.component.html',
  styleUrls: ['./infrastructure.component.scss']
})
export class InfrastructureComponent implements OnInit {
  public Editor = ClassicEditor;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  infraImages: any;
  infraMultiImage: any = [];
  infraData: any = [];
  infraModel: any = {};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  addMultiImg: any = [];
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  infraMulti: any = [];
  multiImage: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.val++;
    this.getInfraDataById();
  }
  openAddInfra() {
    this.infraModel = {};
    this.addMultiImg = [];
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddInfra() {
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
            this.homeService.uploadOInfraImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.infraImages = response;
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
    // console.log(this.infraImages);
    let data ={
      img :this.infraImages
    };
    this.homeService.deleteInfraImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.infraImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  saveInfraDetails() {
    this.infraModel.institute_id = localStorage.getItem('InstituteId');
    this.infraModel.infraImage = this.infraImages;
    this.infraModel.infraMultiImage = this.infraMultiImage;
    this.homeService.saveInfrastructureDetails(this.infraModel).subscribe((res: any) => {
      this.infraData = res;
      this.infraModel.infraImage = null;
      this.infraImages = null;
      this.infraModel.infraMultiImage=[];
      this.infraMultiImage=[];
      this.toastr.success('Infrastructure Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getInfraDataById();
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
            this.homeService.uploadInfraMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.infraMultiImage.push(response);
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
    this.homeService.deleteInfraImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.addMultiImg.splice(val, 1);
  }
  editInfraDetails(data: any) {
    this.infraModel = data;
    this.getInfraMultiImages(data.id);
    this.imageUrl = 'https://api.cesociety.in' + data.infraImage
    this.isOpen = true;
    this.isUpdate = true;
  }
  getInfraMultiImages(id: any) {
    this.multiImage = [];
    this.homeService.getInfraMultiImageById(id).subscribe((res: any) => {
      this.infraMulti = res;
      if (this.infraMulti.length > 0) {
        this.infraMulti.forEach((element: any,ind:any) => {
          this.multiImage.push({ name: ind+1, multiImageUrl: 'https://api.cesociety.in' + element.image });
        });
      }
      this.addMultiImg = this.multiImage;
    })
  }
  updateInfraDetails() {
    this.addMultiImg
    
    if (this.infraImages != null || undefined) {
      this.infraModel.infraImage = this.infraImages;
    }
    this.homeService.updateInfraDetails(this.infraModel).subscribe((res: any) => {
      this.infraData = res;
      this.toastr.success('Infrastructure Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getInfraDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removeInfraDetails(id: any) {
    this.homeService.removeInfraById(id).subscribe((res: any) => {
      this.infraData = res;
      this.toastr.success('Infrastructure Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getInfraDataById();
    })
  }
  getInfraDataById() {
    this.homeService.getImfraDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.infraData = res;
      for (let i = 0; i < this.infraData.length; i++) {
        this.infraData[i].index = i + 1;
      }
      this.collectionSize = this.infraData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.infraData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewInfraDetails(id: any) {
    this.router.navigate(['/infra-details', id]);
  }

}
