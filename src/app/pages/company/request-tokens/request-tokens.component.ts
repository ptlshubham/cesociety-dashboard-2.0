import { Component, ViewEncapsulation } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { emailData } from './data';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokensService } from 'src/app/core/services/tokens.service';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-request-tokens',
  templateUrl: './request-tokens.component.html',
  styleUrl: './request-tokens.component.scss',
  encapsulation: ViewEncapsulation.None // 
})
export class RequestTokensComponent {
  // bread crumb items
  submitted = false;
  validationForm!: FormGroup;
  tokenModel: any = {};
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  addMultiImg: any = [];
  val: number = 0;
  tokenImage: any;
  tokenMultiImage: any = [];
  multiTokenImgData: any = [];

  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;
  emailData!: Array<any>;
  emailIds: number[] = [];
  totalRecords = 0;
  startIndex = 1;
  endIndex = 15;
  page = 1;
  pageSize = 15;
  managerList: any = [];
  designerList: any = [];
  clientList: any = [];
  labelList: any = [{ name: 'CES' }, { name: 'Urgent' }];
  employeeList: any = [];
  assignedEmpData: any = [];
  createdby: any;
  tokenData: any = [];
  isMailOpen: boolean = false;
  openTokenData: any = {};
  constructor(private modalService: NgbModal,
    public formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    public tokensService: TokensService,
    private companyService: CompanyService
  ) {

    this.getAllToken();
  }

  ngOnInit(): void {
    this.val++;
    this.createdby = localStorage.getItem('Name');
    this.isMailOpen = false;
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      client: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      designer: ['', [Validators.required]],
      label: [''],
      deliverydate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],

    });
  }
  get f() { return this.validationForm.controls; }

  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      this.clientList = res;
    })
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;

    })
  }
  onClientChange(data: any) {
    this.assignedEmpData = [];
    this.designerList = [];
    this.managerList = [];
    this.tokenModel.managers = [];
    this.tokenModel.designers = [];
    this.tokenModel.clientid = data.id;
    this.tokenModel.clientname = data.name;
    this.getAssignedEmpData(data.id);
  }
  onLabelChange(data: any) {
    debugger
    this.tokenModel.label = data.name;
  }
  getAssignedEmpData(id: any) {
    this.companyService.getAssignedEmpDetailsById(id).subscribe((res: any) => {
      this.assignedEmpData = res;
      this.designerList = res.filter((employee: any) => employee.role === 'Designer');
      this.managerList = res.filter((employee: any) => employee.role === 'Manager');
    })
  }
  open(content: any) {
    this.getClientsDetails();
    this.getAllEmployeeDetails();
    this.modalService.open(content, { size: 'xl', centered: true });
  }


  addMultipleImage() {
    this.val++;
    this.addMultiImg.push(
      {
        name: this.val,
        multiImageUrl: 'assets/images/file-upload-image.jpg'
      }
    );
  }
  uploadFile(event: any) {
    debugger
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          this.imageUrl = reader.result;
          const imgBase64Path = reader.result;
          this.cardImageBase64 = imgBase64Path;
          const formdata = new FormData();
          formdata.append('file', file);
          this.tokensService.uploadTokenImage(formdata).subscribe((response) => {
            this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
            this.tokenImage = response;
            debugger
            this.editFile = false;
            this.removeUpload = true;
          });

        };
      };
    }
  }
  uploadMultiFile(event: any, ind: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          this.addMultiImg[ind].multiImageUrl = reader.result;
          const imgBase64Path = reader.result;
          this.cardImageBase64 = imgBase64Path;
          const formdata = new FormData();
          formdata.append('file', file);
          this.tokensService.UploadMultiToken(formdata).subscribe((response) => {
            this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
            this.tokenMultiImage.push(response);
            this.addMultiImg[ind].multiImageUrl = response;
            debugger
            this.editFile = false;
            this.removeUpload = true;
          });
        }
      };
    };
  }
  removeUploadedImage() {
    let data = {
      img: this.tokenImage
    };
    this.tokensService.deleteInfraImage(data).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.tokenImage = null;
    this.imageUrl = 'assets/images/file-upload-image.jpg';
  }
  removeUploadedMultiImage(val: any) {
    debugger
    let data = {
      img: this.addMultiImg[val].multiImageUrl

    };
    this.tokensService.RemoveRefrenceMultiImage(data).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.addMultiImg.splice(val, 1);

  }
  SaveTokendetails() {
    debugger

    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.tokenModel.image = this.tokenImage;
      this.tokenModel.tokenMultiImage = this.tokenMultiImage;
      debugger
      this.tokenModel.status = 'Pending';
      this.tokenModel.createdby = this.createdby;
      this.tokensService.SaveTokendetails(this.tokenModel).subscribe((res: any) => {
        this.tokenData = res;
        this.toastr.success('Token Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.tokenModel = {};
        this.validationForm.markAsUntouched();
        // this.BackToTable()
      })
    }
  }
  getAllToken() {
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      this.tokenData = res;
      this.emailData = this.tokenData;
      this.totalRecords = this.tokenData.length;
      for (let i = 0; i < this.tokenData.length; i++) {
        this.tokenData[i].index = i + 1;
      }
    })
  }
  openTokenEmailDetails(data: any) {
    this.multiTokenImgData = [];
    if (data.unread == true) {
      this.tokensService.updateMarkAsRead(data.id).subscribe((res: any) => {
        this.getAllToken();
      })
    }
    this.tokensService.getMultiTokenImageData(data.id).subscribe((res: any) => {
      this.multiTokenImgData = res;
    })

    this.isMailOpen = true;
    this.openTokenData = data;
  }

  backToToken() {
    this.isMailOpen = false;
    this.openTokenData = {};
    this.multiTokenImgData = [];
  }
  downloadImage(imageUrl: string): void {
    const filename = this.generateFileName(imageUrl);
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Programmatically trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        // Handle error as needed
      });
  }
  generateFileName(imageUrl: string): string {
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    return filename;
  }
  confirm() {
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
        this.deleteMail();
        Swal.fire('Deleted!', 'Mail has been deleted.', 'success');
      }
    });
  }

  /***
   * Delete Mail
   */
  deleteMail() {
    const found = this.emailData.some(r => this.emailIds.indexOf(r.id) >= 0);
    if (found) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.emailIds.length; i++) {
        const obj: any = this.emailData.find(o => o.id === this.emailIds[i]);
        this.emailData.splice(this.emailData.indexOf(obj), 1);
      }
    }
    this.emailIds = [];
  }

  /***
   * send mail select multiple mail
   */
  selectMail(event: any, id: any) {
    if (event.target.checked) {
      this.emailIds.push(id);
    } else {
      this.emailIds.splice(this.emailIds.indexOf(id), 1);
    }
  }

  /**
   * Handle on page click event
   */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize + 1;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    this.emailData = emailData.slice(this.startIndex - 1, this.endIndex - 1);
  }
}
