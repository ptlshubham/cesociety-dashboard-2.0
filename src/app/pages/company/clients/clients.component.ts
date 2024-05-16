import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  multiDefaultOption = 'Adam';
  medialist: any = [
    { name: 'IG' },
    { name: 'FB' },
    { name: 'TW' },
    { name: 'LI' },
    { name: 'GMB' },
    { name: 'YT' },

  ];
  selectedmedialist: any;
  submitted = false;
  clientData: any = []
  staffModel: any = {};
  clientModel: any = {};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  editFile: boolean = true;
  removeUpload: boolean = false;
  designerlist: any = [];
  managerlist: any = []
  clientsData: any = [];
  hasclientdata: boolean = false;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  employeeList: any = [];

  cardImageBase64: any;
  clientlogo: any = null;

  validationForm!: FormGroup;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  assignedEmpData: any = [];
  assignedDesignerList: any = [];
  assignedManagerList: any = [];

  constructor(
    public formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,

  ) { }
  ngOnInit(): void {
    this.getStaffDetails();
    this.getClientsDetails();

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
  selectedMediaList(e: any): void {
    this.selectedmedialist = e.target.value;
  }

  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.designerlist = res.filter((employee: any) => employee.role === 'Designer');
      this.managerlist = res.filter((employee: any) => employee.role === 'Manager');
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
        this.toastr.error('Please upload an image with dimensions of 200x200px', 'Invalid Dimension', { timeOut: 3000, });
      }
    };
  }
  removeUploadedImage() {
    this.clientlogo = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
    })
  }
  SaveClientDetails() {
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
        this.BackToTable()
      })
    }
  }
  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      res.forEach((element: any, index: number) => {
        if (res.length > 0) {
          const mediaArray = element.media.split(',').map((item: any) => item.trim());
          res[index].mediaArray = mediaArray;
          this.companyService.getAssignedEmpDetailsById(element.id).subscribe((data: any) => {
            res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
            res[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          })
        }
      });
      this.clientsData = res;
      for (let i = 0; i < this.clientsData.length; i++) {
        this.clientsData[i].index = i + 1;
      }
      this.collectionSize = this.clientsData.length;
      debugger
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.clientsData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  removeClientsDetails(id: any) {
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
        this.companyService.removeClientDetailsById(id).subscribe((req) => {
        })
        Swal.fire('Deleted!', 'Client details has been deleted.', 'success');

      }
    });

  }
  openAddClients() {
    this.isOpen = true;
    this.isUpdate = false;
    this.clientModel = {};
    this.validationForm.markAsUntouched();
    this.clientlogo = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';

  }
  openUpdateClients(data: any) {
    this.clientModel = data;
    // this.selectedmedialist = data.media;
    this.imageUrl = 'http://localhost:9000' + data.profile_image
    this.clientModel.profile = data.profile_image;
    this.isOpen = true;
    this.isUpdate = true;
  }
  BackToTable() {
    this.isOpen = false;
    this.isUpdate = false;
    this.validationForm.markAsUntouched();
    this.getClientsDetails();
  }
}
