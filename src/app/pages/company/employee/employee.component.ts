import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  validationForm!: FormGroup;
  submitted = false;

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  staffProfileImage: any = null;

  staffData: any = [];
  staffDataTable: any = [];
  isOpen: boolean = false;
  isUpdate: boolean = false;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  staffModel: any = {};
  role: any = [
    { name: 'Manager' },
    { name: 'Designer' },
    { name: 'Developer' },
  ]
  constructor(
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getStaffDetails();

    this.validationForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      name: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]],
      birthday_date: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

  }
  get f() { return this.validationForm.controls; }

  openAddStaff() {
    this.isOpen = true;
    this.isUpdate = false;
    this.staffModel = {};
    this.validationForm.markAsUntouched();
    this.staffProfileImage = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  backToTable() {
    this.isOpen = false;
    this.isUpdate = false;
    this.validationForm.markAsUntouched();


  }
  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === 200 && img.height === 200) {
        if (event.target.files && event.target.files[0]) {
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageUrl = reader.result;
            const imgBase64Path = reader.result;
            this.cardImageBase64 = imgBase64Path;
            const formdata = new FormData();
            formdata.append('file', file);
            this.companyService.saveEmployeeProfileImages(formdata).subscribe((response) => {
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
  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.staffDataTable = res;
      for (let i = 0; i < this.staffDataTable.length; i++) {
        this.staffDataTable[i].index = i + 1;
      }
      this.collectionSize = this.staffDataTable.length;
      this.getPagintaion();
    })
  }
  saveStaffDetails() {
    debugger
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.staffModel.profile = this.staffProfileImage;
      this.companyService.saveEmployeeDetails(this.staffModel).subscribe((res: any) => {
        this.staffData = res;
        this.toastr.success('Staff Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.staffModel = {};
        this.validationForm.markAsUntouched();
        this.isOpen = false;
      })
    }
    this.getStaffDetails();
  }
  getPagintaion() {
    this.paginateData = this.staffDataTable.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  openUpdateStaff(data: any) {
    this.imageUrl = 'http://localhost:9000' + data.profile_image
    this.staffModel = data;
    this.staffModel.birthday_date = new Date(data.birthday_date).toISOString().slice(0, 10);
    this.staffModel.profile = data.profile_image;
    this.isOpen = true;
    this.isUpdate = true;
  }
  removeStaffDetails(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.companyService.removeEmployeeDetailsById(id).subscribe((req) => {
        })
        Swal.fire('Deleted!', 'Staff details has been deleted.', 'success');
        this.getStaffDetails();
      }
    });

  }
  updateStaffDetails() {
    if (this.staffProfileImage != null || undefined) {
      this.staffModel.profile = this.staffProfileImage;
    }
    this.companyService.updaetEmployeeDetails(this.staffModel).subscribe((res: any) => {
      this.staffData = res;
      this.toastr.success('Update Staff Details Successfully.', 'Updated', { timeOut: 3000, });
      this.getStaffDetails();
      this.isOpen = false;
    })
  }
}



