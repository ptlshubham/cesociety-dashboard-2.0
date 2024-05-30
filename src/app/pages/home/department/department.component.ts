import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  departmentModel: any = {};
  departmentData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  multiImage: any = [];
  imageUrl: any = "assets/images/file-upload-image.jpg";
  addMultiImg: any = [];
  val: number = 0;
  public Editor = ClassicEditor;

  @ViewChild('fileInput') el!: ElementRef;
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;

  depImages: any;
  depMulti: any = [];

  isOpen: boolean = false;
  isUpdate: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private homeService: HomeService,
    public toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDepartmentDetails();
    this.validationForm = this.formBuilder.group({
      department: ['', [Validators.required]],
    });
  }
  get f() { return this.validationForm.controls; }

  addServiceList() {
    this.val++;
    this.addMultiImg.push(
      {
        name: this.val,
        multiImageUrl: 'assets/images/file-upload-image.jpg'
      }
    );
  }

  openAddDepartment() {
    this.departmentModel = {};
    this.addMultiImg = [];
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddDepartment() {
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
            this.homeService.uploadDepImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.depImages = response;
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
    // console.log(this.depImages);
    let data = {
      img: this.depImages
    };
    this.homeService.deleteDepImage(data).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.depImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
    
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
            this.homeService.uploadDepMultiImage(formdata).subscribe((response) => {
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.depMulti.push(response);
              this.addMultiImg[ind].multiImageUrl = 'http://localhost:9000' + response;
              this.addMultiImg[ind].url = response;
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
    let data = {
      img: this.addMultiImg[val].multiImageUrl
    };
    this.homeService.deleteDepImage(data).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.addMultiImg.splice(val, 1);
  }

  saveDepartmentList() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.departmentModel.institute_id = localStorage.getItem('InstituteId');
      this.departmentModel.depImage = this.depImages;
      this.departmentModel.depMulti = this.depMulti;
      
      this.homeService.saveDepartmentListData(this.departmentModel).subscribe((res: any) => {
        this.toastr.success('Department added Successfully', 'success', {
          timeOut: 3000,
        });
        this.departmentModel = {};
        this.validationForm.markAsUntouched();
        this.getDepartmentDetails();
        this.isUpdate = false;
        this.isOpen = false;
      })
    }
  }
  getDepartmentDetails() {
    this.homeService.getDepartmentDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.departmentData = res;

      for (let i = 0; i < this.departmentData.length; i++) {
        this.departmentData[i].index = i + 1;
      }
      this.collectionSize = this.departmentData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.departmentData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
  editDepartmentDetails(data: any) {
    this.departmentModel = data;
    
    this.getDepMultiImages(data.id);
    this.imageUrl = 'http://localhost:9000' + data.depimage
    this.isOpen = true;
    this.isUpdate = true;
  }
  getDepMultiImages(id: any) {
    this.multiImage = [];
    this.homeService.getDepMultiImageById(id).subscribe((res: any) => {
      this.depMulti = res;
      if (this.depMulti.length > 0) {
        this.depMulti.forEach((element: any, ind: any) => {
          this.multiImage.push({ name: ind + 1, multiImageUrl: 'http://localhost:9000' + element.image, url: element.image });
        });
      }
      this.addMultiImg = this.multiImage;
      this.departmentModel.depMulti = this.addMultiImg;

    })
  }
  updateDepartmentDetails() {

    if (this.depImages != null || undefined) {
      
      this.departmentModel.depImage = this.depImages;
    }
    else {
      this.departmentModel.depImage = this.departmentModel.depimage;
    }
    
    this.homeService.updateDepartmentListData(this.departmentModel).subscribe((res: any) => {
      if (res == 'success') {
        this.toastr.success('Department Updated Successfully', 'success', {
          timeOut: 3000,

        });
        this.isUpdate = false;
        this.isOpen = false;
      }
    })
  }
  removeDepartmentdata(id: any) {
    this.homeService.removeDepartmentDataById(id).subscribe((res: any) => {
      this.departmentData = res;
      this.toastr.success('Department removed Successfully', 'success', {
        timeOut: 3000,
      });
      this.getDepartmentDetails();
    })
  }
  viewDepartmentDetails(id: any) {
    this.router.navigate(['/dep-details', id]);
  }
}
