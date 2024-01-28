import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-student-result',
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.scss']
})
export class StudentResultComponent implements OnInit {
  imageUrl: any = "assets/images/file-upload-image.jpg";
  validationForm!: FormGroup;
  submitted = false;
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  resultImage: any;
  isUpdate: boolean = false;
  resultModel: any = {};
  resultData: any = [];
  filterData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  years: { value: string }[] = [];
  currentYears: any;
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,

  ) { }

  ngOnInit(): void {
    this.getResultDataById();
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      year: ['', [Validators.required]]
    });
    const currentYear = new Date().getFullYear();
    this.currentYears = currentYear;
    for (let i = 2010; i <= currentYear; i++) {
      this.years.push({ value: i.toString() });
    }
  }
  get f() { return this.validationForm.controls; }

  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        const imgBase64Path = reader.result;
        this.cardImageBase64 = imgBase64Path;
        const formdata = new FormData();
        formdata.append('file', file);


        this.homeService.uploadBannersImage(formdata).subscribe((response) => {
          this.resultImage = response;
          this.toastr.success('Student Result Image Uploaded Successfully.', 'Uploaded', { timeOut: 3000, });
          this.editFile = false;
          this.removeUpload = true;
        })
      }
      // ChangeDetectorRef since file is loading outside the zone
      // this.cd.markForCheck();

    }
  }
  onYearChange(event: any) {
    console.log('Selected Year:', event.target.value);
    this.filterData = [];
    this.resultData.forEach((element: any) => {
      if (element.year == event.target.value) {
        this.filterData.push(element);
      }
    });
    this.paginateData = this.filterData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  saveResultDetails() {
    this.resultModel.image = this.resultImage;
    this.resultModel.institute_id = localStorage.getItem('InstituteId');
    this.homeService.saveResultData(this.resultModel).subscribe((res: any) => {
      this.resultData = res;
      this.resultModel = {};
      this.validationForm.markAsUntouched();
      this.imageUrl = 'assets/images/file-upload-image.jpg';
      this.toastr.success('Student Result Details Successfully Saved.', 'Success', { timeOut: 3000, });
      this.getResultDataById();
    })
  }
  getResultDataById() {
    this.homeService.getResultDetailsById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.resultData = res;
      for (let i = 0; i < this.resultData.length; i++) {
        this.resultData[i].index = i + 1;
      }
      this.collectionSize = this.resultData.length;
      this.getPagintaion();

    })
  }
  getPagintaion() {
    this.filterData = [];
    this.resultData.forEach((element: any) => {
      if (element.year == this.currentYears) {
        this.filterData.push(element);
      }
    });
    this.paginateData = this.filterData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  openEditResult(data: any) {
    this.isUpdate = true;
    this.resultModel = data;
    this.imageUrl = 'https://api.cesociety.in' + data.image
    this.resultModel.image = data.image;

  }
  updateResultDetails() {
    if (this.resultImage != null || undefined) {
      this.resultModel.profile = this.resultImage;
    }
    this.homeService.updateResultDetails(this.resultModel).subscribe((res: any) => {
      this.resultData = res;
      this.toastr.success('Result Details Successfully Updated.', 'Updated', { timeOut: 3000, });
      this.getResultDataById();
    })
  }
  removeResult(id: any) {
    this.homeService.removeResultDetailsById(id).subscribe((res: any) => {
      this.resultData = res;
      this.toastr.success('Result Details Removed Successfully.', 'Deleted', { timeOut: 3000, });
      this.getResultDataById();
      // this.getPagintaion();
    })
  }
}
