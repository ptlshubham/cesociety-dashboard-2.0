import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DonationService } from 'src/app/core/services/donation.service';
import * as XLSX from 'xlsx';
type AOA = any[][];


@Component({
  selector: 'app-rahotkarsh-bulk-upload',
  templateUrl: './rahotkarsh-bulk-upload.component.html',
  styleUrls: ['./rahotkarsh-bulk-upload.component.scss']
})
export class RahotkarshBulkUploadComponent implements OnInit {
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  uploadedData: any = [];
  bulkUploadedData: any = [];
  beneficiaryData: any = [];

  constructor(
    private donationService: DonationService,
    private router: Router,
    public toastr: ToastrService

  ) { }

  ngOnInit(): void {
  }
  backToTable() {
    this.router.navigate(['/rahotkarsh']);

  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log("data:", this.data);
      this.uploadedData = this.data;
      this.toastr.success('File Uploaded Successfully', 'Uploaded', {
        timeOut: 3000,
      });
      this.saveBulkUploadData();
      this.data.map(res => {
        if (res[0] === "no") {
          console.log(res[0]);
        } else {
          console.log(res[0]);
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }

  saveBulkUploadData() {

    this.bulkUploadedData = [];
    this.uploadedData

    for (let i = 1; i < this.uploadedData.length; i++) {
      let data = {
        year: this.uploadedData[i][0],
        studentName: this.uploadedData[i][1],
        instituteName: this.uploadedData[i][2],
        course: this.uploadedData[i][3],
        refundAmount: this.uploadedData[i][4]
      }
      this.bulkUploadedData.push(data);
    }
    this.bulkUploadedData
    let tempArray: any = [];
    for (let i = 0; i <= (this.bulkUploadedData.length / 300); i++) {
      tempArray = [];
      let lnth = (this.bulkUploadedData.length / 300);
      
      if (i == 0) {
        tempArray = [];
        tempArray = this.bulkUploadedData.slice(0, 300);
        
        this.donationService.saveBulkBeneficiaryDetails(tempArray).subscribe((res: any) => {
         
        })
      } else if (i != (this.bulkUploadedData.length / 300)) {
        tempArray = [];
        let start = i * 300;
        let end = start + 300;
        tempArray = this.bulkUploadedData.slice(start, end);
        
        this.donationService.saveBulkBeneficiaryDetails(tempArray).subscribe((res: any) => {
         
        })
      }
      else {
        tempArray = [];
        let start = (i - 1) * 300;
        let end = this.bulkUploadedData.length - start;
        tempArray = this.bulkUploadedData.slice(start, end);
        
        this.donationService.saveBulkBeneficiaryDetails(tempArray).subscribe((res: any) => {
        
        })
      }

    }

    // this.donationService.saveBulkBeneficiaryDetails(this.bulkUploadedData).subscribe((res: any) => {
    //   this.toastr.success('File data save Successfully', 'Saved', {
    //     timeOut: 3000,
    //   });
    //   this.beneficiaryData = res;
    // })
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
