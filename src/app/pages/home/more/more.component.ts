import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {
  public Editor = ClassicEditor;

  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  otherImages: any;
  moreModel: any = {};
  moreData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  role: any;
  filterdata: any = [];
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getScholarshipData();
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
            this.homeService.uploadMoreImage(formdata).subscribe((response: any) => {
              this.otherImages = response;
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000 });
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
    this.otherImages = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  saveScholarshipDetails() {
    this.moreModel.institute_id = localStorage.getItem('InstituteId');
    this.moreModel.image = this.otherImages
    this.homeService.saveScholarshipDetails(this.moreModel).subscribe((res: any) => {
      this.moreData = res;
      this.toastr.success('Others Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.getScholarshipData();
    })
  }
  onChange(val: any) {
    debugger
    this.role = val.target.value
    if (this.role != 'All') {
      this.moreData = [];
      this.filterdata.forEach((element: any) => {
        if (element.purpose == this.role) {
          this.moreData.push(element);
        }
      });
    }
    else {
      this.getScholarshipData();
    }
    for (let i = 0; i < this.moreData.length; i++) {
      this.moreData[i].index = i + 1;
    }
    this.collectionSize = this.moreData.length;
    this.getPagintaion();
  }
  getScholarshipData() {
    this.homeService.getScholarshipData(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.moreData = res;
      this.filterdata = res;
      debugger
      for (let i = 0; i < this.moreData.length; i++) {
        this.moreData[i].index = i + 1;
      }
      this.collectionSize = this.moreData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.moreData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  removeScholarship(id: any) {
    this.homeService.removeScholarshipData(id).subscribe((res: any) => {
      this.moreData = res;
      this.getScholarshipData();
    })
  }
  viewMoreDetails(id: any) {
    this.router.navigate(['/more-details', id]);
  }
}
