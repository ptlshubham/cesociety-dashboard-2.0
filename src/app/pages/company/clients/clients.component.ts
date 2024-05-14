import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  multiDefaultOption = 'Adam';
  medialist: any = [
    { name: 'instagram' },
    { name: 'FaceBook' },
    { name: 'twitter' },
    { name: 'Linkedin' },
    { name: 'GMB' },
    { name: 'Youtube' },

  ];
  submitted = false;
  clientData: any = []
  staffModel: any = {};
  clientModel: any = {};

  editFile: boolean = true;
  removeUpload: boolean = false;
  designerlist: any = [];
  managerlist: any = []
  staffDataTable: any = [];
  hasclientdata: boolean = false;
  imageUrl: any = "assets/images/file-upload-image.jpg";

  cardImageBase64: any;
  clientlogo: any = null;

  validationForm!: FormGroup;


  constructor(
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,

  ) { }
  ngOnInit(): void {
    this.getStaffDetails();

    this.validationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      bussinesstype: ['', [Validators.required]],
      media: ['', [Validators.required]],
      post: ['', [Validators.required]],
      story: ['', [Validators.required]],
      reels: ['', [Validators.required]],
      extra: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      designersrole: ['', [Validators.required]],
      instaid: [''],
      instapass: [''],
      facebooklink: [''],
      twitterlink: [''],
      linkedinlink: [''],
      youtubelink: ['']
    });
  }
  get f() { return this.validationForm.controls }
  formatSelectedMedia(mediaArray: any[]): string {
    const formattedMedia = mediaArray.map(media => media.name).join(', ');
    this.clientModel.selectedmedia = formattedMedia;
    debugger
    return formattedMedia;
  }

  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.designerlist = res.filter((employee: any) => employee.role.toLowerCase() === 'designer');
      this.managerlist = res.filter((employee: any) => employee.role.toLowerCase() === 'manager');
    })
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
            this.companyService.SaveClientImage(formdata).subscribe((response) => {
              this.clientlogo = response;
              this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
              this.editFile = false;
              this.removeUpload = true;

            })
          }
        }
      } else {
        this.imageUrl = 'assets/images/file-upload-image.jpg';
        this.clientlogo = null;
        this.toastr.error('Please upload an image with dimensions of 472x472px', 'Invalid Dimension', { timeOut: 3000, });
      }
    };
  }
  removeUploadedImage() {
    this.clientlogo = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
  }
  SaveClientDetails() {
    debugger
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.clientModel.profile = this.clientlogo;

      this.companyService.SaveClientDetails(this.clientModel).subscribe((res: any) => {
        this.clientData = res;
        this.toastr.success('Client Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.clientModel = {};
        this.validationForm.markAsUntouched();

      })
    }
  }
}
