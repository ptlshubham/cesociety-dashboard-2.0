import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-answer-key',
  templateUrl: './answer-key.component.html',
  styleUrls: ['./answer-key.component.scss']
})
export class AnswerKeyComponent implements OnInit {

  @ViewChild('fileInput') el!: ElementRef;
  answerkeyModel: any = {};
  answerkeyData: any = [];
  public Editor = ClassicEditor;
  isOpen: boolean = false;

  pdfResponse: any = '';

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;

  constructor(
    private homeService: HomeService,
    public toastr: ToastrService

  ) { }


  ngOnInit(): void {
    this.getAnswerkeyDetails();
  }
  getAnswerkeysDetails() {
    throw new Error('Method not implemented.');
  }
  openAddAnswerkey() {
    this.isOpen = true;
  }
  closeAddAnswerkey() {
    this.isOpen = false;
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
        this.homeService.savePdfData(formdata).subscribe((response) => {
          this.toastr.success('File uploaded successfully.', 'Success', { timeOut: 3000 });
          this.pdfResponse = response;
        }, (error) => {
          this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          this.progressType = 'danger';
        }, () => {
          this.progressValue = 100; // Set progress bar to 100% when upload is complete
        });
      };
    }
  }
  saveAnswerkeyDetails() {
    if (this.pdfResponse != "") {
      this.answerkeyModel.files = this.pdfResponse;
    }
    else {
      this.answerkeyModel.files = null;
    }
    this.answerkeyModel.institute_id = localStorage.getItem('InstituteId');
    this.homeService.saveAnswerkeyListData(this.answerkeyModel).subscribe((res: any) => {
      this.toastr.success('Answer key added successfully', 'Success', {
        timeOut: 3000,
      });
      this.getAnswerkeyDetails();
      this.isOpen = false;

    })
  }
  getAnswerkeyDetails() {
    this.homeService.getAnswerkeyDataById().subscribe((res: any) => {
      this.answerkeyData = res;
      for (let i = 0; i < this.answerkeyData.length; i++) {
        this.answerkeyData[i].index = i + 1;
      }
      this.collectionSize = this.answerkeyData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.answerkeyData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
  activeAnswerkey(ind: any) {
    let inde = ind - 1;
    this.answerkeyData[inde].isactive = true;
    this.homeService.activeDeavctiveAnswerkey(this.answerkeyData[inde]).subscribe((req) => {
      this.toastr.success('Answerkey/Event activated Successfully.', 'Activated', {
        timeOut: 3000,
      });
    })
  }
  deactiveAnswerkey(ind: any) {
    let inde = ind - 1;
    this.answerkeyData[inde].isactive = false;
    this.homeService.activeDeavctiveAnswerkey(this.answerkeyData[inde]).subscribe((req) => {
      this.toastr.error('Answerkey/Event deactivated Successfully.', 'Deactivated', {
        timeOut: 3000,
      });
    })
  }
  removeAnswerkeyById(id: any) {
    this.homeService.removeAnswerkeyDataById(id).subscribe((res: any) => {
      this.answerkeyData = res;
      this.toastr.success('Answerkey deleted successfully', 'Deleted', {
        timeOut: 3000,
      });
      this.getAnswerkeyDetails();
    })
  }
  viewDownloadPdf(data: any) {
    var path
    path = 'http://localhost:9000' + data

    window.open(path, '_blank');
  }
}
