import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
  emailIds: any[] = [];
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
  activeTab: string = 'allTokens';
  role: any;
  pendingData: any = [];
  processingData: any = [];
  reviewData: any = [];
  changesData: any = [];
  completedData: any = [];
  cancelData: any = [];
  cesLabelData: any = [];
  urgentLabelData: any = [];
  statusChange: any = []
  isEditToken: boolean = false;
  @ViewChild('content') modalShow !: TemplateRef<any>;

  constructor(private modalService: NgbModal,
    public formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    public tokensService: TokensService,
    private companyService: CompanyService
  ) {
    this.getClientsDetails();
  }

  ngOnInit(): void {
    this.val++;
    this.createdby = localStorage.getItem('Name');
    this.role = localStorage.getItem('Role');
    this.isMailOpen = false;
    this.setActiveTab('allTokens');
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    if (this.role != 'Designer') {
      this.getAllToken();
    }
    else {
      this.getTokenByEmployee();
    }
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

    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.tokenModel.image = this.tokenImage;
      this.tokenModel.tokenMultiImage = this.tokenMultiImage;
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

  setActiveTab(tab: string): void {
    this.emailData = [];
    this.activeTab = tab;

    if (this.role != 'Designer') {
      if (this.activeTab == 'allTokens') {
        this.getAllToken();

      }
      else if (this.activeTab == 'pendingTokens') {
        this.emailData = this.pendingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'processingTokens') {
        this.emailData = this.processingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'reviewTokens') {
        this.emailData = this.reviewData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'changesTokens') {
        this.emailData = this.changesData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'completedTokens') {
        this.emailData = this.completedData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'cancelTokens') {
        this.emailData = this.cancelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'CES') {
        this.emailData = this.cesLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'Urgent') {
        this.emailData = this.urgentLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
    }
    else {
      if (this.activeTab == 'allTokens') {
        this.getTokenByEmployee();
      }
      else if (this.activeTab == 'pendingTokens') {
        this.emailData = this.pendingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'processingTokens') {
        this.emailData = this.processingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'reviewTokens') {
        this.emailData = this.reviewData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'changesTokens') {
        this.emailData = this.changesData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'completedTokens') {
        this.emailData = this.completedData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'cancelTokens') {
        this.emailData = this.cancelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'CES') {
        this.emailData = this.cesLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'Urgent') {
        this.emailData = this.urgentLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
    }

  }
  openClientWiseList(id: any) {
    this.emailData = [];
    this.tokenData.forEach((element: any) => {
      if (element.clientid == id) {
        this.emailData.push(element);
      }
      this.totalRecords = this.emailData.length;
      for (let i = 0; i < this.emailData.length; i++) {
        this.emailData[i].index = i + 1;
      }
    });
  }
  getAllToken() {
    this.tokensService.getAllTokenData().subscribe((res: any) => {

      res.forEach((element: any, index: number) => {
        if (res.length > 0) {
          this.companyService.getAssignedEmpDetailsById(element.clientid).subscribe((data: any) => {
            res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
            res[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          })
        }
      });
      this.pendingData = res.filter((token: any) => token.status === 'Pending');
      this.processingData = res.filter((token: any) => token.status === 'Processing');
      this.reviewData = res.filter((token: any) => token.status === 'Review');
      this.changesData = res.filter((token: any) => token.status === 'Changes');
      this.completedData = res.filter((token: any) => token.status === 'Completed');
      this.cancelData = res.filter((token: any) => token.status === 'Cancel');
      this.cesLabelData = res.filter((token: any) => token.label === 'CES');
      this.urgentLabelData = res.filter((token: any) => token.label === 'Urgent');
      this.tokenData = res;
      this.emailData = this.tokenData;
      this.totalRecords = this.tokenData.length;
      for (let i = 0; i < this.tokenData.length; i++) {
        this.tokenData[i].index = i + 1;
      }
    })

  }

  getTokenByEmployee() {
    this.tokensService.getTokenByEmpIdData(localStorage.getItem('Eid')).subscribe((res: any) => {
      res.forEach((element: any, index: number) => {
        if (res.length > 0) {
          this.companyService.getAssignedEmpDetailsById(element.clientid).subscribe((data: any) => {
            res[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
            res[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          })
        }
      });
      this.pendingData = res.filter((token: any) => token.status === 'Pending');
      this.processingData = res.filter((token: any) => token.status === 'Processing');
      this.reviewData = res.filter((token: any) => token.status === 'Review');
      this.changesData = res.filter((token: any) => token.status === 'Changes');
      this.completedData = res.filter((token: any) => token.status === 'Completed');
      this.cancelData = res.filter((token: any) => token.status === 'Cancel');
      this.cesLabelData = res.filter((token: any) => token.label === 'CES');
      this.urgentLabelData = res.filter((token: any) => token.label === 'Urgent');


      this.tokenData = res;
      this.emailData = this.tokenData;
      this.totalRecords = this.tokenData.length;
      for (let i = 0; i < this.tokenData.length; i++) {
        this.tokenData[i].index = i + 1;
      }
    })
  }
  getMultiTokenImages(id: any) {
    this.tokensService.getMultiTokenImageData(id).subscribe((res: any) => {
      this.multiTokenImgData = res;
    })
  }
  openTokenEmailDetails(data: any) {
    debugger
    this.isEditToken = false;
    this.multiTokenImgData = [];
    if (data.unread == true) {
      this.tokensService.updateMarkAsRead(data.id).subscribe((res: any) => {
        this.getAllToken();


      })
    }
    this.getMultiTokenImages(data.id);
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      res.forEach((element: any) => {
        if (data.clientid == element.id) {
          data.clientlogo = element.logo
        }

      });
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
  selectMail(event: any, id: any) {
    if (event.target.checked) {
      let req = {
        id: id,
        status: 'Cancel'
      }
      this.emailIds.push(req);
      if (this.emailIds.length == 1) {
        this.isEditToken = true;
      }
      else {
        this.isEditToken = false;
      }
    } else {
      this.emailIds.splice(this.emailIds.indexOf(id), 1);
      if (this.emailIds.length == 1) {
        this.isEditToken = true;
      }
      else {
        this.isEditToken = false;
      }
    }
  }
  editTokenDetails() {
    this.designerList = [];
    this.managerList = [];
    this.addMultiImg = [];
    this.getAllEmployeeDetails();
    this.modalService.open(this.modalShow, { size: 'xl', centered: true });
    this.tokenData.forEach((element: any) => {
      if (element.id == this.emailIds[0].id) {
        this.tokenModel = element;

        this.tokensService.getMultiTokenImageData(this.tokenModel.id).subscribe((res: any) => {
          this.multiTokenImgData = res;
          if (this.multiTokenImgData.length > 0) {

            this.multiTokenImgData.forEach((element: any, ind: any) => {
              this.addMultiImg.push({ name: ind + 1, multiImageUrl: 'http://localhost:9000' + element.image });
            });
          }
        })
        this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
          this.employeeList = res;
          this.designerList = this.employeeList.filter((employee: any) => employee.role === 'Designer');
          this.managerList = this.employeeList.filter((employee: any) => employee.role === 'Manager');
        });

        // Fetch assigned employees and set tokenModel designers and managers
        this.tokensService.getAssignedTokenEmp(this.tokenModel.id).subscribe((res: any) => {
          const assignedDesignerList = res.filter((employee: any) => employee.role === 'Designer');
          const assignedManagerList = res.filter((employee: any) => employee.role === 'Manager');
          this.tokenModel.designers = assignedDesignerList;
          this.tokenModel.managers = assignedManagerList;
        });
        this.clientList.forEach((element: any) => {
          if (element.id == this.tokenModel.clientid) {
            this.tokenModel.client = element.name;

          }
        });
        this.imageUrl = 'http://localhost:9000' + this.tokenModel.image;
      }

    });
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
  changeStatusById(id: any, status: any) {
    let data = {
      id: id,
      status: status,
      isStateUpdate: true
    }
    this.tokensService.updateTokenStatus(data).subscribe((res: any) => {
      this.openTokenData.status = res;
      this.openTokenEmailDetails(data);
      this.getAllToken();
    });
  }
}
