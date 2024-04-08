import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-placement-cell',
  templateUrl: './placement-cell.component.html',
  styleUrls: ['./placement-cell.component.scss']
})
export class PlacementCellComponent implements OnInit {
  public Editor = ClassicEditor;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  placeImages:any;
  placeMultiImage: any = [];
  placementData:any=[];
  placementModel:any={};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  addMultiImg: any = [];
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  placeMulti: any = [];
  multiImage: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.val++;
    this.getPlacementDataById();
  }
  openAddPlacement() {
    this.placementModel = {};
    this.addMultiImg = [];
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddPlacement() {
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
            this.homeService.uploadPlacementImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.placeImages = response;
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
    // console.log(this.placeImages);
    let data ={
      img :this.placeImages
    };
    this.homeService.deletePlacementImage(data).subscribe((res:any)=>{
      if(res =='sucess'){
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      }else{
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.placeImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  savePlacementDetails() {
    this.placementModel.institute_id = localStorage.getItem('InstituteId');
    this.placementModel.placeImage = this.placeImages;
    this.placementModel.placeMultiImage = this.placeMultiImage;
    this.homeService.savePlacementDetails(this.placementModel).subscribe((res: any) => {
      this.placementData = res;
      this.placementModel.placeImage = null;
      this.placeImages = null;
      this.placementModel.placeMultiImage=[];
      this.placeMultiImage=[];
      this.toastr.success('Placement Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getPlacementDataById();
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
            this.homeService.uploadPlacementMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.placeMultiImage.push(response);
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
  editPlacementDetails(data: any) {
    this.placementModel = data;
    this.getPlacementMultiImage(data.id);
    this.imageUrl = 'https://api.cesociety.in' + data.placeImage
    
    this.isOpen = true;
    this.isUpdate = true;
  }
  getPlacementMultiImage(id: any) {
    this.multiImage = [];
    this.homeService.getPlacementMultiImageById(id).subscribe((res: any) => {
      this.placeMulti = res;
      if (this.placeMulti.length > 0) {
        this.placeMulti.forEach((element: any,ind:any) => {
          this.multiImage.push({ name: ind+1, multiImageUrl: 'https://api.cesociety.in' + element.image });
        });
      }
      this.addMultiImg = this.multiImage;
    })
  }
  updatePlacementDetails() {
    this.addMultiImg
    
    if (this.placeImages != null || undefined) {
      this.placementModel.placeImage = this.placeImages;
    }
    this.homeService.updatePlacementDetails(this.placementModel).subscribe((res: any) => {
      this.placementData = res;
      this.toastr.success('Placement Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getPlacementDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removePlacementById(id: any) {
    this.homeService.removePlacementById(id).subscribe((res: any) => {
      this.placementData = res;
      this.toastr.success('Placement Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getPlacementDataById();
    })
  }
  getPlacementDataById() {
    this.homeService.getPlacementDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.placementData = res;
      
      for (let i = 0; i < this.placementData.length; i++) {
        this.placementData[i].index = i + 1;
      }
      this.collectionSize = this.placementData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.placementData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewPlacementDetails(id: any) {
    this.router.navigate(['/placement-details', id]);
  }

}
