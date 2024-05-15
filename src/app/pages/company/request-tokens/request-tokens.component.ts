import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { emailData } from './data';
import { RequestTokens } from './request-tokens.model';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokensService } from 'src/app/core/services/tokens.service';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-request-tokens',
  templateUrl: './request-tokens.component.html',
  styleUrl: './request-tokens.component.scss'
})
export class RequestTokensComponent {
  // bread crumb items
  validationForm!: FormGroup;
  tokenModel: any = {};
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  addMultiImg: any = [];
  val: number = 0;
  refrenceImage: any;
  refrenceMultiImage: any = [];

  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;
  emailData!: Array<RequestTokens>;
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

  constructor(private modalService: NgbModal,
    public formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    public tokensService: TokensService,
    private companyService: CompanyService
  ) {
    this.getClientsDetails();
    this.getAllEmployeeDetails();
  }

  ngOnInit(): void {
    this.val++;
    this.emailData = emailData;
    this.totalRecords = emailData.length;
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      client: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      designer: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      label: [''],
      deliverydate: ['', [Validators.required]],
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
    this.getAssignedEmpData(data.id);
  }

  getAssignedEmpData(id: any) {
    this.companyService.getAssignedEmpDetailsById(id).subscribe((res: any) => {
      this.assignedEmpData = res;
    })
  }
  open(content: any) {
    this.modalService.open(content, { size: 'xl', centered: true });
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
          this.tokensService.uploadRefrenceImage(formdata).subscribe((response) => {
            this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
            this.refrenceImage = response;
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
          this.tokensService.UploadMultiRefrence(formdata).subscribe((response) => {
            this.toastr.success('Image Uploaded Successfully', 'Uploaded', { timeOut: 3000, });
            this.refrenceMultiImage = response
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
      img: this.refrenceImage
    };
    this.tokensService.deleteInfraImage(data).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('Image removed successfully.', 'Deleted', { timeOut: 2000, });
      } else {
        this.toastr.error('Something went wrong try again later', 'Error', { timeOut: 2000, });
      }
    })
    this.refrenceImage = null;
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

}
