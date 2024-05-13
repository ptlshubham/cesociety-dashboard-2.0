import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss']
})
export class MagazineComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  magazineModel: any = {};
  magazine: any = [];
  pdfResponse: any = null;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,

  ) { }

  ngOnInit(): void {
    this.getMagazineDetails();
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
  }
  get f() { return this.validationForm.controls; }

  saveMagazineDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      if (this.pdfResponse != "") {
        this.magazineModel.files = this.pdfResponse;
      }
      else {
        this.magazineModel.files = null;
      }
      this.homeService.saveMagazineDetails(this.magazineModel).subscribe((res: any) => {
        this.toastr.success('Magazine added Successfully', 'Success', {
          timeOut: 3000,
        });
        this.getMagazineDetails();
      })
    }
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
  viewDownloadPdf(data: any) {
    var path
    path = 'http://localhost:9000' + data

    window.open(path, '_blank');
  }
  removeMagazineDetails(id: any) {
    this.homeService.removeMagazineList(id).subscribe((res: any) => {
      this.magazine = res;
      this.toastr.success('Magazine Deleted Successfully', 'Removed', {
        timeOut: 3000,
      });
      this.getMagazineDetails();
    })
  }
  getMagazineDetails() {
    this.homeService.getMagazineList().subscribe((res: any) => {
      this.magazine = res;
      for (let i = 0; i < this.magazine.length; i++) {
        this.magazine[i].index = i + 1;
      }
      this.collectionSize = this.magazine.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.magazine
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
