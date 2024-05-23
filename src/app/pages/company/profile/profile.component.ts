import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { MustMatch } from 'src/app/account/auth/validation.mustmatch';

import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  unlockForm!: UntypedFormGroup;
  profile!: UntypedFormGroup;
  breadCrumbItems!: Array<{}>;
  valid: boolean = false;
  unlockSubmit = false;
  passwordValue: string = '';
  resetPwdModel: any = {}
  loginTotalTime: number = 0;
  in_time: any;
  StaffData: any = []
  staffModel: any = {};
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  clientlogo: any = null;
  staffProfileImage: any = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
    private router: Router,



  ) {
  }
  ngOnInit(): void {
    this.getStaffDetails()
    this.breadCrumbItems = [
      { label: 'Contacts' },
      { label: 'Profile', active: true }
    ];
    this.unlockForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmpwd: ['', Validators.required]
    }, {
      // validator: MustMatch('password', 'confirmpwd'),
    });
  }
  get a() { return this.unlockForm.controls; }
  get f() { return this.profile.controls; }


  onResetSubmit() {
    this.unlockSubmit = true;
    if (this.unlockForm.invalid) {
      return;
    }
    else {
      if (this.valid) {
        this.resetPwdModel.id = localStorage.getItem('Eid')
        this.resetPwdModel.password = this.a.password.value;
        this.resetPwdModel.confirmpwd = this.a.confirmpwd.value;
        this.companyService.updatePassword(this.resetPwdModel).subscribe((data) => {
          if (data == "error") {
            this.toastr.error('This Contact Number is already registered.', 'Error', { timeOut: 3000 });
          }
          else {
            this.toastr.success('Your password has been successfully changed.', 'success', {
              timeOut: 3000,
            });
            this.logout();
          }
        });
      }
    }
  }
  logout() {
    this.router.navigate(['/account/keryar-login']);
  }
  getStaffDetails() {
    debugger
    this.companyService.getEmployeeDataById(localStorage.getItem('Eid')).subscribe((data: any) => {
      this.staffModel = data[0];
      this.staffModel.name = localStorage.getItem('Name')
    })
  }

  getTimeDifference(intime: string): number {
    const currentTime = new Date();
    const intimeDate = new Date(intime);
    if (intimeDate < currentTime) {
      const timeDifference = currentTime.getTime() - intimeDate.getTime();
      const timeDifferenceInMinutes = Math.floor(timeDifference / (1000 * 60));
      this.loginTotalTime = timeDifferenceInMinutes;
      return timeDifferenceInMinutes;
    } else {
      console.error('Login time is in the future!');
      return NaN; // or handle it according to your requirements
    }
  }
  onPasswordFocusOut() {
    let data = {
      id: localStorage.getItem('Eid'),
      password: this.passwordValue
    }
    debugger
    this.companyService.ChackForPassword(data).subscribe((data: any) => {
      if (data.error == "Invalid credentials") {
        this.valid = false;
        this.toastr.error('Your old password is incorrect', 'Error', { timeOut: 3000 });
      }
      else {
        if (data.message == "success") {
          this.valid = true;
        }
      }
    })
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
              this.updatelogo()
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.editFile = false;
              this.removeUpload = true;

            })
          }
        }
      } else {
        this.imageUrl = 'assets/images/file-upload-image.jpg';
        this.staffProfileImage = null;
        this.toastr.error('Please upload an image with dimensions of 200X200', 'Invalid Dimension', { timeOut: 3000, });
      }
    };

  }
  updatelogo() {
    this.companyService.saveEmployeeProfileImages(this.staffModel).subscribe((req) => {
      this.toastr.success('Logo updated successfully', 'Updated', { timeOut: 3000 });
    });
  }
  removeUploadedImage() {
    this.staffProfileImage = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
}
