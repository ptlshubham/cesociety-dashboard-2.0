import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-commitee',
  templateUrl: './commitee.component.html',
  styleUrls: ['./commitee.component.scss']
})
export class CommiteeComponent implements OnInit {
  public Editor = ClassicEditor;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  commImages: any;
  commMultiImage: any = [];
  commiData: any = [];
  commiModel: any = {};
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
    this.getCommeteeDataById();
  }
  openAddInfra() {
    this.commiModel = {};
    this.addMultiImg = [];
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddComm() {
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
            this.homeService.uploadCommitteeImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.commImages = response;
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
    // console.log(this.commImages);
    let data ={
      img :this.commImages
    };
    this.homeService.deleteCommiImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.commImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  saveCommiteeDetails() {
    this.commiModel.institute_id = localStorage.getItem('InstituteId');
    this.commiModel.commImage = this.commImages;
    this.commiModel.commMultiImage = this.commMultiImage;
    
    this.homeService.saveCommeeteDetails(this.commiModel).subscribe((res: any) => {
      this.commiData = res;
      this.commiModel.commImage = null;
      this.commImages = null;
      this.commiModel.commMultiImage=[];
      this.commMultiImage=[];
      this.toastr.success('Infrastructure Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getCommeteeDataById();
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
            this.homeService.uploadCommitteeMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.commMultiImage.push(response);
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
    this.homeService.deleteCommiImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.addMultiImg.splice(val, 1);
  }
  editCommiteeDetails(data: any) {
    this.commiModel = data;
    this.getCommiteeMultiImage(data.id);
    this.imageUrl = 'https://api.cesociety.in' + data.commImage
    this.isOpen = true;
    this.isUpdate = true;
  }
  getCommiteeMultiImage(id: any) {
    this.multiImage = [];
    this.homeService.getCommiteeMultiImageById(id).subscribe((res: any) => {
      this.infraMulti = res;
      if (this.infraMulti.length > 0) {
        this.infraMulti.forEach((element: any,ind:any) => {
          this.multiImage.push({ name: ind+1, multiImageUrl: 'https://api.cesociety.in' + element.image });
        });
      }
      this.addMultiImg = this.multiImage;
    })
  }
  updateCommiteeDetails() {
    this.addMultiImg
    
    if (this.commImages != null || undefined) {
      this.commiModel.commImage = this.commImages;
    }
    this.homeService.updateCommiteeDetails(this.commiModel).subscribe((res: any) => {
      this.commiData = res;
      this.toastr.success('Infrastructure Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getCommeteeDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removeCommiteeById(id: any) {
    this.homeService.removeCommiteeById(id).subscribe((res: any) => {
      this.commiData = res;
      this.toastr.success('Infrastructure Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getCommeteeDataById();
    })
  }
  getCommeteeDataById() {
    this.homeService.getCommeteeDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.commiData = res;
      
      for (let i = 0; i < this.commiData.length; i++) {
        this.commiData[i].index = i + 1;
      }
      this.collectionSize = this.commiData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.commiData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewCommiteeDetails(id: any) {
    this.router.navigate(['/comm-details', id]);
  }

}
