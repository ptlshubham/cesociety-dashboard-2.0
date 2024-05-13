import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import { StaffService } from 'src/app/core/services/staff.services';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  staffProfileImage: any = null;
  departmentData: any = [];
  staffModel: any = {
    joining_date: null
  };
  staffData: any = [];
  staffDataTable: any = [];
  isOpen: boolean = false;
  isUpdate: boolean = false;
  positionData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  pdfResponse: any;
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  constructor(
    private homeService: HomeService,
    private staffService: StaffService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.getDepartmentDetails();
    this.getStaffDetails();
    this.getPositionData();

    this.validationForm = this.formBuilder.group({
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      name: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]],
      birthday_date: ['', [Validators.required]],
      joining_date: ['', [Validators.required]],
    });

  }
  get f() { return this.validationForm.controls; }

  openAddStaff() {
    this.isOpen = true;
    this.isUpdate = false;
    this.staffModel = {};
    this.validationForm.markAsUntouched();
    this.staffProfileImage = null;
    this.pdfResponse = undefined;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
  }
  backToTable() {
    this.isOpen = false;
    this.isUpdate = false;
    this.pdfResponse = undefined;
    this.validationForm.markAsUntouched();
  }
  getDepartmentDetails() {
    this.homeService.getDepartmentDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.departmentData = res;
    })
  }
  getPositionData() {
    this.positionData = [];
    for (let i = 1; i <= 10; i++) {
      this.positionData.push(i);
    }
  }
  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 472 && img.height === 472) {
        if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageUrl = reader.result;
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.staffService.saveStaffProfileImages(formdata).subscribe((response) => {
              this.staffProfileImage = response;
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.editFile = false;
              this.removeUpload = true;

            })
          }
        }
      } else {
        this.imageUrl = 'assets/images/file-upload-image.jpg';
        this.staffProfileImage = null;
        this.toastr.error('Please upload an image with dimensions of 472x472px', 'Invalid Dimension', { timeOut: 3000, });
      }
    };
  }
  removeUploadedImage() {
    this.staffProfileImage = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  uploadPdfFile(event: any) {
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
  saveStaffDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.staffModel.researchPaper = this.pdfResponse;
      this.staffModel.institute_id = localStorage.getItem('InstituteId');
      this.staffModel.profile = this.staffProfileImage;
      this.staffService.saveStaffDetails(this.staffModel).subscribe((res: any) => {
        this.progressValue = 0;
        this.isProgress = false;
        this.staffData = res;
        this.toastr.success('Staff Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.staffModel = {};
        this.pdfResponse = undefined;
        this.validationForm.markAsUntouched();
        this.getStaffDetails();
        this.isOpen = false;
      })
    }
  }

  getStaffDetails() {
    this.staffService.getAllStaffDetailsData(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.staffDataTable = res;
      for (let i = 0; i < this.staffDataTable.length; i++) {
        this.staffDataTable[i].index = i + 1;
      }
      this.collectionSize = this.staffDataTable.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.staffDataTable.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  openUpdateStaff(data: any) {
    this.imageUrl = 'http://localhost:9000' + data.profile_image
    this.staffModel = data;
    this.staffModel.joining_date = new Date(data.joining_date).toISOString().slice(0, 10);
    this.staffModel.birthday_date = new Date(data.birthday_date).toISOString().slice(0, 10);
    this.staffModel.profile = data.profile_image;
    this.progressValue = 0;
    this.isProgress = false;
    this.isOpen = true;
    this.isUpdate = true;
  }
  // onBirthdayDateChange(value: string) {
  //   console.log('New birthday date:', value);
  // }
  updateStaffDetails() {
    if (this.pdfResponse != null || undefined) {
      this.staffModel.researchPaper = this.pdfResponse;
    }
    if (this.staffProfileImage != null || undefined) {
      this.staffModel.profile = this.staffProfileImage;
    }
    this.staffService.updaetStaffDetails(this.staffModel).subscribe((res: any) => {
      this.staffData = res;
      this.toastr.success('Update Staff Details Successfully.', 'Updated', { timeOut: 3000, });
      this.getStaffDetails();
      this.progressValue = 0;
      this.isProgress = false;
      this.isOpen = false;
    })
  }
  removeResearchPaperDoc(id: any) {
    this.staffService.removeStaffPaper(id).subscribe((res: any) => {
      if (res == 'success') {
        this.getStaffDetails();
        this.toastr.success('Removed Staff Research Paper successfully Done.', 'Deleted', { timeOut: 3000, });
        this.isOpen = false;
        this.isUpdate = false;
      }
    })
  }
  removeStaffDetails(id: any) {
    this.staffService.removeStaffDetailsById(id).subscribe((res: any) => {
      this.staffDataTable = res;
      this.toastr.success('Staff Details Removed Successfully.', 'Removed', { timeOut: 3000, });
      this.getStaffDetails();
    })
  }
}
