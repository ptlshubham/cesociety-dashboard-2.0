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
  pageSize = 50;
  collectionSize = 0;
  paginateData: any = [];
  staffModel: any = {};
  role: any = [
    { name: 'Manager' },
    { name: 'Designer' },
    { name: 'Developer' },
    { name: 'SubAdmin' },
  ]
  filterEmployeeList: any = [];

  searchQuery: string = '';

  designerData: any = []
  constructor(
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
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
    this.companyService.getEmployeeDetailsData().subscribe((res: any) => {
      this.staffDataTable = res.filter((staff: any) => staff.role !== 'companyAdmin');
      for (let i = 0; i < this.staffDataTable.length; i++) {
        this.staffDataTable[i].index = i + 1;
      }
      this.collectionSize = this.staffDataTable.length;
      this.filterEmployeeList = [...this.staffDataTable];
      this.getPagintaion();
    })
  }
  saveStaffDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.staffModel.profile = this.staffProfileImage;
      this.companyService.saveEmployeeDetails(this.staffModel).subscribe((res: any) => {
        this.staffData = res;
        this.toastr.success('Staff Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.staffModel = {};
        this.getStaffDetails();
        this.validationForm.markAsUntouched();
        this.isOpen = false;
      })
    }
  }
  getPagintaion() {
    this.paginateData = this.filterEmployeeList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  openUpdateStaff(data: any) {
    this.imageUrl = 'http://localhost:9000' + data.profile_image;
    this.staffModel.profile = data.profile_image;
    this.staffModel = data;
    this.staffModel.birthday_date = new Date(data.birthday_date).toISOString().slice(0, 10);

    this.isOpen = true;
    this.isUpdate = true;
  }
  removeStaffDetails(id: any, status: any) {
    if (status == 0) {
      var isactive = true;
    }
    else {
      var isactive = false;
    }
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
        let data = {
          id: id,
          isactive: isactive
        }
        this.companyService.removeEmployeeDetailsById(data).subscribe((req) => {
        })
        Swal.fire('Deleted!', 'Staff details has been deleted.', 'success');

      }
    });

  }
  updateStaffDetails() {
    if (this.staffProfileImage != null || undefined) {
      this.staffModel.profile = this.staffProfileImage;
    }
    debugger
    this.companyService.updaetEmployeeDetails(this.staffModel).subscribe((res: any) => {
      this.staffData = res;
      this.toastr.success('Update Staff Details Successfully.', 'Updated', { timeOut: 3000, });
      this.getStaffDetails();
      this.isOpen = false;
    })
  }

  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      res.forEach((element: any, index: number) => {
        if (res.length > 0) {
          const mediaArray = element.media.split(',').map((item: any) => item.trim());
          res[index].mediaArray = mediaArray;
          this.companyService.getAssignedEmpDetailsById(element.id).subscribe((data: any) => {
            res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
          })
        }
      });
      this.designerData = res;
      for (let i = 0; i < this.designerData.length; i++) {
        this.designerData[i].index = i + 1;
      }
      this.collectionSize = this.designerData.length;

      this.getPagintaion();
    })
  }
  applySearchFilter() {
    this.page = 1; // Reset the page when the search query changes
    this.filterEmployeeList = this.staffDataTable.filter((employee: any) =>
      (employee.name).toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.getPagintaion();
  }
}



