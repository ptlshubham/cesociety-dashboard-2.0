import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-naac',
  templateUrl: './naac.component.html',
  styleUrls: ['./naac.component.scss']
})
export class NaacComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;
  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  removeUpload: boolean = false;
  cardImageBase64: any;
  staffProfileImage: any = null;
  isOpen: boolean = false;
  isUpdate: boolean = false;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  pdfResponse: any = '';
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  pdfResponse1: any = '';
  progressValue1: number = 0; // Variable to track the progress value
  progressType1: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress1: boolean = false;

  NAACDetailsModel: any = {};

  // For Select Dropdown with new entry
  criteria = [
    { name: 'Criteria 1' },
    { name: 'Criteria 2' },
    { name: 'Criteria 3' },
    { name: 'Criteria 4' },
    { name: 'Criteria 5' },
    { name: 'Criteria 6' },
    { name: 'Criteria 7' },
    { name: 'SSR' },
    { name: 'AQAR' }
  ];

  keyIndicator = [];
  srNumber = [];
  selectedCriteria: any;
  selectedKeyNo: any;
  NaacData: any = [];
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
  ) {
    this.criteria = [
      { name: 'Criteria 1' },
      { name: 'Criteria 2' },
      { name: 'Criteria 3' },
      { name: 'Criteria 4' },
      { name: 'Criteria 5' },
      { name: 'Criteria 6' },
      { name: 'Criteria 7' },
      { name: 'SSR' },
      { name: 'AQAR' }
    ]
    this.selectedCriteria = null;
  }

  ngOnInit(): void {
    this.getAllNAACDetails();
    this.getGroupKeyNoDetails();
    this.validationForm = this.formBuilder.group({
      // criteria: ['', Validators.required],
      // keyIndicator: ['', Validators.required],
      paraname: ['', Validators.required]
    });
  }
  get f() { return this.validationForm.controls; }

  openAddNAACDetails() {
    this.isOpen = true;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.selectedKeyNo = {};
    this.NAACDetailsModel = {};
    this.progressValue = 0;
    this.progressValue1 = 0;
    this.isProgress = false;
    this.isProgress1 = false;
    debugger
    this.validationForm.markAsUntouched();

  }
  backToList() {
    this.isOpen = false;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.selectedKeyNo = {};
    this.NAACDetailsModel = {};
    this.progressValue = 0;
    this.progressValue1 = 0;
    this.isProgress = false;
    this.isProgress1 = false;
    this.validationForm.markAsUntouched();


  }
  uploadParameterPdfFile(event: any) {
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
  uploadAttachmentPdfFile(event: any) {
    this.isProgress1 = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file form control
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file', file);
        // Reset progress bar
        this.progressValue1 = 0;
        this.progressType1 = 'success';
        this.homeService.savePdfData(formdata).subscribe((response) => {
          this.toastr.success('File uploaded successfully.', 'Success', { timeOut: 3000 });
          this.pdfResponse1 = response;
        }, (error) => {
          this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          this.progressType1 = 'danger';
        }, () => {
          this.progressValue1 = 100; // Set progress bar to 100% when upload is complete
        });
      };
    }
  }
  // For Add New Items
  addNewIndicator(term: string): any {
    return { keyno: term };
  }

  // For changing onevent
  onCriteriaChange(event: any) {
    this.selectedCriteria = event.name;
  }
  onKeyIndicatorChange(event: any) {
    this.selectedKeyNo = event.keyno
  }
  saveNAACDetails() {
    this.NAACDetailsModel.criteria = this.selectedCriteria;
    this.NAACDetailsModel.keyNo = this.selectedKeyNo;
    this.NAACDetailsModel.paralink = this.pdfResponse;
    this.NAACDetailsModel.attachlink = this.pdfResponse1;
    this.homeService.saveNaacDetails(this.NAACDetailsModel).subscribe((res: any) => {
      this.NaacData = res;
      this.NAACDetailsModel = {};
      this.selectedCriteria = {};
      this.selectedKeyNo = {};
      this.pdfResponse = '';
      this.pdfResponse1 = '';
      this.isProgress = false;
      this.isProgress1 = false;
      this.progressValue = 0;
      this.progressValue1 = 0;
      this.getAllNAACDetails();
      this.getGroupKeyNoDetails();
      this.validationForm.markAsUntouched();
      this.toastr.success('NAAC Details added Successfully.', 'Saved', { timeOut: 3000, });
    })
  }

  getAllNAACDetails() {
    this.homeService.getNAACData().subscribe((res: any) => {
      this.NaacData = res;
      debugger
      for (let i = 0; i < this.NaacData.length; i++) {
        this.NaacData[i].index = i + 1;
      }
      this.collectionSize = this.NaacData.length;
      this.getPagintaion();
      this.getGroupKeyNoDetails();
    })
  }
  getPagintaion() {
    this.paginateData = this.NaacData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  getGroupKeyNoDetails() {
    this.homeService.getKeyNoGroup().subscribe((res: any) => {
      this.keyIndicator = res;
    })
  }
  openNaacDetails(data: any) {
    this.NAACDetailsModel = data;
    if (data.attachname != 'undefined') {
      this.NAACDetailsModel.attachname = data.attachname;
    }
    else {
      this.NAACDetailsModel.attachname = '';
    }
    if (data.paralink != 'undefined') {
      this.NAACDetailsModel.paralink = data.paralink;
    }
    else {
      this.NAACDetailsModel.paralink = null;
    }
    if (data.attachlink != 'undefined') {
      this.NAACDetailsModel.attachlink = data.attachlink;
    }
    else {
      this.NAACDetailsModel.attachlink = null;
    }
    this.selectedCriteria = data.criteria;
    this.selectedKeyNo = data.keyno;
    this.isUpdate = true;
    this.isOpen = true;
  }
  updateNaacDetails() {
    this.NAACDetailsModel.criteria = this.selectedCriteria;
    this.NAACDetailsModel.keyno = this.selectedKeyNo;
    if (this.pdfResponse != '' && this.pdfResponse != 'undefined') {
      this.NAACDetailsModel.paralink = this.pdfResponse;
    }
    else {
      this.NAACDetailsModel.paralink
    }
    if (this.pdfResponse1 != '' && this.pdfResponse1 != 'undefined') {
      this.NAACDetailsModel.attachlink = this.pdfResponse1;
    }
    else {
      this.NAACDetailsModel.attachlink
    }
    this.homeService.updateNAACData(this.NAACDetailsModel).subscribe((res: any) => {
      this.NaacData = res;
      this.toastr.success('NAAC Crietria Updated Successfully', 'Updated', {
        timeOut: 3000,
      });
      this.validationForm.markAsUntouched();
      this.getAllNAACDetails();
    })
  }
  removeNaacDetails(id: any) {
    this.homeService.removeNaacCrieteriaList(id).subscribe((res: any) => {
      this.NaacData = res;
      this.toastr.success('NAAC Crietria Deleted Successfully', 'Removed', {
        timeOut: 3000,
      });
      this.isUpdate = false;
      this.isOpen = false;
      this.getAllNAACDetails();
    })
  }
}
