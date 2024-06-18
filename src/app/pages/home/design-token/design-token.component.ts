import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TokensService } from 'src/app/core/services/tokens.service';

@Component({
  selector: 'app-design-token',
  templateUrl: './design-token.component.html',
  styleUrl: './design-token.component.scss'
})
export class DesignTokenComponent implements OnInit {
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
  paginateData!: Array<any>;
  emailData!: Array<any>;
  emailIds: any[] = [];

  totalRecords = 0;
  startIndex = 1;
  endIndex = 20;
  page = 1;
  pageSize = 10;

  activeTab: string = 'allTokens';
  isMailOpen: boolean = false;
  tokenData: any = [];
  tempTokenData: any = [];
  openTokenData: any = {};

  pendingData: any = [];
  processingData: any = [];
  completedData: any = [];
  instituteURL: any = localStorage.getItem('InstituteURL');
  instituteId: any = localStorage.getItem('InstituteId');

  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  fileResponse: any = null;
  constructor(private modalService: NgbModal,
    public formBuilder: UntypedFormBuilder,
    public tokensService: TokensService,
    public toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.val++;
    this.setActiveTab('allTokens');
    this.breadCrumbItems = [
      { label: 'Home' },
      { label: 'Generate Tokens', active: true }
    ];
    this.validationForm = this.formBuilder.group({
      createdby: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      expecteddate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],

    });
  }
  get f() { return this.validationForm.controls; }
  setActiveTab(tab: string): void {
    this.emailData = [];
    this.activeTab = tab;
    this.isMailOpen = false;
    if (this.activeTab == 'allTokens') {
      this.getAllToken();
    }
    else if (this.activeTab == 'pendingTokens') {
      this.emailData = this.pendingData;
      this.getArrayLengthOfEmail();
    }
    else if (this.activeTab == 'processingTokens') {
      this.emailData = this.processingData;
      this.getArrayLengthOfEmail();
    }
    else if (this.activeTab == 'completedTokens') {
      this.emailData = this.completedData;
      this.getArrayLengthOfEmail();
    }
  }

  getArrayLengthOfEmail() {
    this.paginateData = [];
    this.totalRecords = this.emailData.length;
    for (let i = 0; i < this.emailData.length; i++) {
      this.emailData[i].index = i + 1;
    }
    this.getPagintaion();
  }

  open(content: any) {
    this.isProgress = false;
    this.fileResponse = null;
    this.modalService.open(content, { size: 'xl', centered: true });
  }
  openMailData(data: any) {
    this.openTokenData = data;
    this.isMailOpen = true;
    this.tokensService.getMultiTokenImageData(data.id).subscribe((res: any) => {
      this.multiTokenImgData = res;
    })
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
  uploadImageFile(event: any) {
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
  addMultipleImage() {
    this.val++;
    this.addMultiImg.push(
      {
        name: this.val,
        multiImageUrl: 'assets/images/file-upload-image.jpg'
      }
    );
  }

  SaveTokendetails() {

    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.tokenModel.image = this.tokenImage;
      this.tokenModel.tokenMultiImage = this.tokenMultiImage;
      this.tokenModel.instituteid = this.instituteId;
      this.tokenModel.institutename = localStorage.getItem('InstituteName');
      this.tokenModel.status = 'Pending';
      this.tokenModel.file = this.fileResponse.filePath;
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

  getAllToken() {
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      if (this.instituteURL == 'www.cesociety.in') {
        this.tokenData = res;
        this.updateDerivedData();
      }
      else {
        this.tokenData = res.filter((token: any) => token.instituteid == this.instituteId);
        this.updateDerivedData();
      }
      debugger
    });
  }
  updateDerivedData() {
    this.pendingData = this.tokenData.filter((token: any) => token.status === 'Pending');
    this.processingData = this.tokenData.filter((token: any) => token.status === 'Processing');
    this.completedData = this.tokenData.filter((token: any) => token.status === 'Completed');
    this.emailData = this.tokenData;
    this.totalRecords = this.tokenData.length;
    this.tokenData.forEach((token: { index: any; }, index: number) => token.index = index + 1);
    this.getPagintaion();
  }
  getPagintaion() {
    debugger
    this.paginateData = this.emailData.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
  removeCesToken(id: any) {
    this.tokensService.removeCesToken(id).subscribe((res: any) => {
      this.toastr.success('Token Deleted Successfully.', 'Success', { timeOut: 3000, });
      this.getAllToken()
    });
  }
  uploadFile(event: any) {
    this.isProgress = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file form control
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file', file);
        // Reset progress bar
        this.progressValue = 0;
        this.progressType = 'success';
        this.tokensService.saveTokenFileData(formdata).subscribe((response) => {
          this.toastr.success('File uploaded successfully.', 'Success', { timeOut: 3000 });
          this.fileResponse = response;
        }, (error) => {
          this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          this.progressType = 'danger';
        }, () => {
          this.progressValue = 100; // Set progress bar to 100% when upload is complete
        });
      };
    }
  }

  downloadFile(data: string) {
    const filePath = 'http://localhost:9000' + data;
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Extract file extension from the file path
        const fileExtension = filePath.split('.').pop();

        // Set the download attribute based on the file extension
        a.download = `token-file.${fileExtension}`;

        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error reading the file:', error);
      });
  }

  deleteUploadedFile(data: any) {
    const path = 'http://localhost:9000' + data;
    debugger
    this.tokensService.removeTokenFileData(data).subscribe((res: any) => {
      this.toastr.success('File Deleted Successfully.', 'Success', { timeOut: 3000, });
      this.isProgress = false;
      this.fileResponse = null;
    });
    // this.http.delete(path).subscribe(
    //   response => {
    //     console.log('File deleted successfully');
    //     this.fileResponse = null; // Reset the fileResponse
    //   },
    //   error => {
    //     console.error('Error deleting file', error);
    //   }
    // );
  }

}
