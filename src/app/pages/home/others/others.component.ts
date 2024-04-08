import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  othersModel: any = {};
  othersData: any = [];
  pdfResponse: any = '';

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  role: any;
  filterdata: any = [];
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.getFormsDetails();
    this.pdfResponse = null;
    this.validationForm = this.formBuilder.group({
      purpose: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
  }
  get f() { return this.validationForm.controls; }

  uploadFile(event: any) {
    this.isProgress = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file form control
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file', file);
        // Reset progress bar
        this.progressValue = 0;
        this.progressType = 'success';
        this.homeService.savePdfData(formdata).subscribe((response) => {
          this.toastr.success('File uploaded successfully.', 'Success', { timeOut: 3000 });
          this.pdfResponse = response;
        }, (error) => {
          this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          this.progressType = 'danger';
        }, () => {
          this.progressValue = 100; // Set progress bar to 100% when upload is complete
        });
      };
    }
  }
  saveFormsDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      if (this.pdfResponse != "") {
        this.othersModel.files = this.pdfResponse;
      }
      else {
        this.othersModel.files = null;
      }
      this.othersModel.institute_id = localStorage.getItem('InstituteId');
      this.homeService.saveOthersListData(this.othersModel).subscribe((res: any) => {
        this.toastr.success('Data saved successfully', 'success', {
          timeOut: 3000,
        });
        this.progressValue = 0;
        this.isProgress = false;
        this.othersModel = {};
        this.pdfResponse = null;
        this.validationForm.markAsUntouched();
        this.getFormsDetails();
      })
    }
  }
  onChange(val: any) {
    
    this.role = val.target.value
    if (this.role != 'All') {
      this.othersData = [];
      this.filterdata.forEach((element: any) => {
        if (element.purpose == this.role) {
          this.othersData.push(element);
        }
      });
    }
    else {
      this.getFormsDetails();
    }
    for (let i = 0; i < this.othersData.length; i++) {
      this.othersData[i].index = i + 1;
    }
    this.collectionSize = this.othersData.length;
    this.getPagintaion();
  }
  getFormsDetails() {
    this.homeService.getothersDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.othersData = res;
      
      this.filterdata = res;
      for (let i = 0; i < this.othersData.length; i++) {
        this.othersData[i].index = i + 1;
      }
      this.collectionSize = this.othersData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.othersData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  removeOtherDetails(id: any) {
    this.homeService.removeOtherList(id).subscribe((res: any) => {
      this.othersData = res;
      this.toastr.success('Deleted Successfully', 'Removed', {
        timeOut: 3000,
      });
      this.getFormsDetails();
    })
  }
  viewDownloadPdf(data: any) {
    var path
    path = 'https://api.cesociety.in' + data

    window.open(path, '_blank');
  }

}
