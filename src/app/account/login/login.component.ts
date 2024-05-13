import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth.service';
import { LAYOUT_MODE } from '../../layouts/layouts.model';
import { HomeService } from 'src/app/core/services/home.services';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  loginForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  layout_mode!: string;
  fieldTextType!: boolean;
  institute: any;
  collegeList: any = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    private userService: UserProfileService,
    private homeService: HomeService
  ) {
    this.getAllInstituteDetails();
    // redirect to home if already logged in
    localStorage.clear();
    if (
      this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if (this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    document.body.setAttribute('data-layout', 'vertical');
  }
  getAllInstituteDetails() {
    this.homeService.getAllInstituteData().subscribe((res: any) => {
      this.collegeList = res;
    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSelectionChange(event: any) {
    const selectedIndex = event.target.selectedIndex;
    const selectedId = this.collegeList[selectedIndex - 1].id; // Subtract 1 because the first option is the placeholder
    debugger
    this.institute = selectedId;
  }
  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.userService.userLogin(this.f.email.value, this.f.password.value, this.institute).subscribe((res: any) => {

        if (res.length > 0) {
          localStorage.setItem('InstituteId', res[0].id);
          localStorage.setItem('InstituteName', res[0].name);
          localStorage.setItem('InstituteURL', res[0].url);
          localStorage.setItem('Role', 'Institute');
          localStorage.setItem('token', res[0].token);
          this.toastr.success('Login Successfully', 'success', { timeOut: 3000, });
          this.router.navigate(['/']);
        } else if (res == 1) {
          this.toastr.error('Incorrect Email !....please check your Email', 'wrong email', {
            timeOut: 3000,
          });
        } else {
          this.toastr.error('Incorrect Password !....please check your Password', 'wrong password', {
            timeOut: 3000,
          });
        }
      })
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
