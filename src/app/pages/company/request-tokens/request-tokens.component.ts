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
  endIndex = 20;
  page = 1;
  pageSize = 20;
  managerList: any = [];
  designerList: any = [];
  clientList: any = [];
  labelList: any = [{ name: 'CES' }, { name: 'Urgent' }];
  employeeList: any = [];
  assignedEmpData: any = [];
  createdby: any;
  tokenData: any = [];
  tempTokenData: any = [];
  isMailOpen: boolean = false;
  openTokenData: any = {};
  activeTab: string = 'allTokens';
  role: any;
  pendingData: any = [];
  dailyWorkData: any = [];
  processingData: any = [];
  completedData: any = [];
  cancelData: any = [];
  cesLabelData: any = [];
  urgentLabelData: any = [];
  statusChange: any = []
  isEditToken: boolean = false;
  dailyworkList: any = []
  @ViewChild('content') modalShow !: TemplateRef<any>;
  selectedDate: any = null; // Define a property to hold the selected date
  searchQuery: any = null;
  searchDesignerQuery: any = null;

  staffDataTable: any[] = []; // Your data
  filterEmployeeList: any[] = [];
  originalTokenData: any[] = [];
  filteredTokenData: any[] = [];
  selectedDateRange: { from: Date, to: Date } | null = null; // Define the type of selectedDateRange
  selectedDesignerDateRange: { from: Date, to: Date } | null = null;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  clientModel: any = []
  comapanyRole: any = localStorage.getItem('Role');
  isDailyOpen: boolean = false;
  searchClient: any = null;
  selectedWorkDateRange: { from: Date, to: Date } | null = null;
  eid: any;
  empEmail: any;
  filteredDailyWorkData: any = [];
  constructor(private modalService: NgbModal,
    public formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    public tokensService: TokensService,
    private companyService: CompanyService,

  ) {
    this.getClientsDetails();
  }

  ngOnInit(): void {
    this.val++;
    this.createdby = localStorage.getItem('Name');
    this.role = localStorage.getItem('Role');
    this.eid = localStorage.getItem('Eid');
    this.isMailOpen = false;
    this.setActiveTab('allTokens');
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    this.getStaffDetails();
    this.privatefecth();
    this.validationForm = this.formBuilder.group({
      client: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      designer: ['', [Validators.required]],
      label: [''],
      deliverydate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],

    });
  }
  get f() { return this.validationForm.controls; }

  privatefecth() {
    if (this.role != 'Designer') {
      this.getAllToken();
      this.getAllDailyWork();
    }
    else {
      this.getAllDailyWork();
      this.getTokenByEmployee();

    }
  }
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
      this.tokenModel.email = this.empEmail;
      if (this.tokenModel.description == undefined) {
        this.tokenModel.description = null;
      }
      this.tokensService.SaveTokendetails(this.tokenModel).subscribe((res: any) => {
        // this.tokenData = res;
        this.setActiveTab('allTokens');
        this.toastr.success('Token Details Successfully Saved.', 'Success', { timeOut: 3000, });
        this.tokenModel = {};
        this.validationForm.markAsUntouched();
        this.modalService.dismissAll();
      })
    }
  }

  filterTodayTokens(tokens: any) {

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Only date parts

    return tokens.filter((token: any) => {
      const tokenDate = new Date(token.createddate);
      const tokenDateOnly = new Date(tokenDate.getFullYear(), tokenDate.getMonth(), tokenDate.getDate()); // Only date parts
      return tokenDateOnly.getTime() === todayOnly.getTime();
    });
  }
  setActiveTab(tab: string): void {
    this.emailData = [];
    this.activeTab = tab;
    this.isMailOpen = false;
    if (this.activeTab == 'dailyWork') {
      this.isDailyOpen = true;
    }
    else {
      this.isDailyOpen = false;
    }
    if (this.role != 'Designer') {
      if (this.activeTab == 'allTokens') {
        this.privatefecth();
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
      }
      else if (this.activeTab == 'dailyWork') {
        
        this.filterResetForTokenAll();
        this.getAllDailyWork();
        this.emailData = this.dailyWorkData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'pendingTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.pendingData;

        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'processingTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.processingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'completedTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.completedData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'cancelTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.cancelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'CES') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.cesLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'Urgent') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.urgentLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
    }
    else {
      if (this.activeTab == 'allTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.getTokenByEmployee();
      }
      else if (this.activeTab == 'dailyWork') {
        this.getAllDailyWork();
        this.filterResetForTokenAll();
        this.emailData = this.dailyWorkData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }

      else if (this.activeTab == 'pendingTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.pendingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'processingTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.processingData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'completedTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.completedData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'cancelTokens') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.cancelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'CES') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.cesLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
      else if (this.activeTab == 'Urgent') {
        this.filterResetForDailyAll();
        this.filterResetForTokenAll();
        this.emailData = this.urgentLabelData;
        this.totalRecords = this.emailData.length;
        for (let i = 0; i < this.emailData.length; i++) {
          this.emailData[i].index = i + 1;
        }
      }
    }

  }
  filterResetForDailyAll() {
    this.searchClient = null;
    this.selectedWorkDateRange = null;
  }
  filterResetForTokenAll() {

    this.searchQuery = null;
    this.selectedDateRange = null;
    this.searchDesignerQuery = null;
    this.selectedDesignerDateRange = null;
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
      this.tempTokenData = res;
      this.tempTokenData.forEach((element: any, index: number) => {
        if (this.tempTokenData.length > 0) {
          this.tokensService.getAssignedTokenEmp(element.id).subscribe((data: any) => {
            this.tempTokenData[index].assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
            this.tempTokenData[index].assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
          });
        }
      });
      this.filterTokenData();
    });
  }

  filterTokenData() {
    let filteredData = this.tempTokenData;

    if (this.searchQuery) {
      const searchQueryLower = this.searchQuery.toLowerCase();
      filteredData = filteredData.filter((token: any) => {
        const clientNameMatches = token.clientname.toLowerCase().includes(searchQueryLower);

        const designerMatches = token.assignedDesigners.some((designer: any) =>
          this.employeeList.find((emp: any) => emp.id === designer.id && emp.name.toLowerCase().includes(searchQueryLower))
        );
        const managerMatches = token.assignedManagers.some((manager: any) =>
          this.employeeList.find((emp: any) => emp.id === manager.id && emp.name.toLowerCase().includes(searchQueryLower))
        );
        return designerMatches || managerMatches || clientNameMatches;
      });
    }

    if (this.selectedDateRange) {
      const { from, to } = this.selectedDateRange;
      filteredData = filteredData.filter((token: any) => {
        const tokenDate = new Date(token.createddate); // Adjust 'token.date' to match your date property
        return tokenDate >= from && tokenDate <= to;
      });
    }

    this.tokenData = filteredData;
    this.updateDerivedData();
  }

  updateDerivedData() {
    this.pendingData = this.tokenData.filter((token: any) => token.status === 'Pending');
    this.processingData = this.tokenData.filter((token: any) => token.status === 'Processing');
    this.completedData = this.tokenData.filter((token: any) => token.status === 'Completed');
    this.cancelData = this.tokenData.filter((token: any) => token.status === 'Cancel');
    this.cesLabelData = this.tokenData.filter((token: any) => token.label === 'CES');
    this.urgentLabelData = this.tokenData.filter((token: any) => token.label === 'Urgent');
    this.emailData = this.tokenData;
    this.totalRecords = this.tokenData.length;
    this.tokenData.forEach((token: { index: any; }, index: number) => token.index = index + 1);
  }

  applySearchClient() {
    this.filterTokenData();
  }

  selectedDateRangeData() {
    this.filterTokenData();
  }

  getTokenByEmployee() {
    this.tokensService.getTokenByEmpIdData(this.eid).subscribe((res: any) => {
      this.originalTokenData = res;
      this.tokenData = res;

      this.tokenData.forEach((element: any, index: number) => {
        this.tokensService.getAssignedTokenEmp(element.id).subscribe((data: any) => {
          element.assignedDesigners = data.filter((employee: any) => employee.role === 'Designer');
          element.assignedManagers = data.filter((employee: any) => employee.role === 'Manager');
        });
      });

      this.filterDesignerTokenData();
    });
  }

  filterDesignerTokenData() {
    let filteredData: any[] = this.originalTokenData;

    if (this.searchDesignerQuery) {
      const searchQueryLower = this.searchDesignerQuery.toLowerCase();
      filteredData = filteredData.filter((token: any) => {
        const clientNameMatches = token.clientname.toLowerCase().includes(searchQueryLower);

        const designerMatches = token.assignedDesigners.some((designer: any) =>
          this.employeeList.find((emp: any) => emp.id === designer.id && emp.name.toLowerCase().includes(searchQueryLower))
        );
        const managerMatches = token.assignedManagers.some((manager: any) =>
          this.employeeList.find((emp: any) => emp.id === manager.id && emp.name.toLowerCase().includes(searchQueryLower))
        );
        return designerMatches || managerMatches || clientNameMatches;
      });
    }

    if (this.selectedDesignerDateRange) {
      
      const { from, to } = this.selectedDesignerDateRange;
      filteredData = filteredData.filter((token: any) => {
        const tokenDate = new Date(token.createddate); // Adjust 'token.date' to match your date property
        return tokenDate >= from && tokenDate <= to;
      });
    }

    this.tokenData = filteredData;
    this.updateDerivedData();
  }

  applySearchDesignerClient() {
    this.filterDesignerTokenData();
  }

  selectedDesignerDateRangeData() {
    this.filterDesignerTokenData();
  }
  getMultiTokenImages(id: any) {
    this.tokensService.getMultiTokenImageData(id).subscribe((res: any) => {
      this.multiTokenImgData = res;
    })
  }
  openTokenEmailDetails(data: any) {
    this.isEditToken = false;
    this.multiTokenImgData = [];
    if (data.unread == true) {
      if (this.isDailyOpen) {
        this.tokensService.updateDailyMarkAsRead(data.id).subscribe((res: any) => {
          this.privatefecth();
        })
      }
      else {
        this.tokensService.updateMarkAsRead(data.id).subscribe((res: any) => {
          this.privatefecth();
        })
      }
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
      this.privatefecth();
    });
  }
  getStaffDetails() {
    this.companyService.getEmployeeDataById(this.eid).subscribe((data: any) => {
      this.empEmail = data[0].email;
    })
  }

  deleteToken() {
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


  changeStatusByIdAndDelete(id: any, status: string) {
    // Call the method to change status
    this.changeStatusById(id, status);
    // Call the method to delete token
    this.deleteToken();
  }


  formatSelectedMedia(mediaArray: any[]): string {
    const formattedMedia = mediaArray.map(media => media.name).join(', ');
    this.clientModel.selectedmedia = formattedMedia;
    return formattedMedia;
  }
  extractDateFromDateStr(dateStr: string): string | null {
    // Assuming the dateStr is in 'YYYY-MM-DD' format. Adjust if necessary.
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : dateStr;
  }

  getAllDailyWork() {
    this.getAllEmployeeDetails();
    this.companyService.getAllDailyList().subscribe((data: any) => {
      let filteredData = data;

      if (this.comapanyRole == 'Designer') {
        filteredData = filteredData.filter((element: any) => element.designerid == this.eid);
      }

      if (this.searchClient) {

        const searchClientLower = this.searchClient.toLowerCase();
        filteredData = filteredData.filter((element: any) => {
          // Check client name
          const clientNameMatches = element.clientname.toLowerCase().includes(searchClientLower);

          // Find designer and manager names
          const designer = this.employeeList.find((emp: any) => emp.id === element.designerid);
          const manager = this.employeeList.find((emp: any) => emp.id === element.managerid);

          const designerNameMatches = designer ? designer.name.toLowerCase().includes(searchClientLower) : false;
          const managerNameMatches = manager ? manager.name.toLowerCase().includes(searchClientLower) : false;

          return clientNameMatches || designerNameMatches || managerNameMatches;
        });
      }

      if (this.selectedWorkDateRange) {

        const { from, to } = this.selectedWorkDateRange;
        filteredData = filteredData.filter((element: any) => {
          const date = new Date(element.date);
          return date >= from && date <= to;
        });
      }

      this.filteredDailyWorkData = filteredData;
      this.dailyWorkData = filteredData;
      if (this.searchClient != null || this.selectedWorkDateRange != null) {
        this.setActiveTab('dailyWork');
      }
    });
  }

  applySearchFilterOnClient() {
    this.getAllDailyWork();
  }

  selectedDateRangeWorkData() {
    this.getAllDailyWork();
  }

  isValidDate(dateString: string): boolean {
    // Check if the date string is valid
    return !isNaN(Date.parse(dateString));
  }

  changeStatusMail(event: Event, id: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked == false) {
      let data = {
        id: id,
        iscompleted: isChecked,
      }
      this.companyService.updateDailyById(data).subscribe((res: any) => {

        if (res == 'success') {
          this.companyService.getAllDailyList().subscribe((data: any) => {
            if (this.comapanyRole == 'Designer') {
              data.forEach((element: any) => {
                if (element.designerid == this.eid) {
                  this.dailyWorkData.push(element);
                }
              });
            }
            else {
              this.dailyWorkData = data;
            }
            this.setActiveTab('dailyWork');

          });
        }
      })
    }
    else {
      let data = {
        id: id,
        iscompleted: isChecked,
      }

      this.companyService.updateDailyById(data).subscribe((res: any) => {
        if (res == 'success') {
          this.dailyWorkData = [];
          this.companyService.getAllDailyList().subscribe((data: any) => {
            if (this.comapanyRole == 'Designer') {
              data.forEach((element: any) => {
                if (element.designerid == this.eid) {
                  this.dailyWorkData.push(element);
                }
              });
              this.setActiveTab('dailyWork');
            }
            else {
              this.dailyWorkData = data;
              this.setActiveTab('dailyWork');
            }
          });
        }
      })
    }

  }

}

