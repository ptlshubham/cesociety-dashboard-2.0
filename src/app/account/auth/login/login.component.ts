import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/user.service';

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
  loginForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  // Carousel navigation arrow show
  showNavigationArrows: any;
  fieldTextType!: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private userService: UserProfileService
  ) { }

  ngOnInit(): void {
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    document.body.setAttribute('data-layout', 'vertical');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.userService.adminLogin(this.f.email.value, this.f.password.value).subscribe((res: any) => {
         
        if (res.length > 0) {
          localStorage.setItem('Name', res[0].name);
          localStorage.setItem('token', res[0].token);
          localStorage.setItem('Role', 'superAdmin');
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
   * Testimonial slider
   */
  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
