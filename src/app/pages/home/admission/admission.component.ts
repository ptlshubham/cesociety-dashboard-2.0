import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.scss'
})
export class AdmissionComponent {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  admissionData: any = [];
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAdmissionDetails();
  }
  getAdmissionDetails() {
    this.homeService.getAdmissionList(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.admissionData = res;
      debugger
      for (let i = 0; i < this.admissionData.length; i++) {
        this.admissionData[i].index = i + 1;
      }
      this.collectionSize = this.admissionData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.admissionData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  exportToExcel() {
    if (this.admissionData && this.admissionData.length > 0) {
      // Format the "createdDate" column to only include the date part (YYYY-MM-DD)
      const formattedData = this.admissionData.map((item:any) => ({
        ...item,
        createddate: formatDate(item.createddate, 'yyyy-MM-dd', 'en-US')
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Admission Data');
      XLSX.writeFile(wb, 'admission_data.xlsx');
    } else {
      console.error('Admission data is empty or undefined.');
    }
  }


}
