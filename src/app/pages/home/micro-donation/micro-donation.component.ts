import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-micro-donation',
  templateUrl: './micro-donation.component.html',
  styleUrls: ['./micro-donation.component.scss']
})
export class MicroDonationComponent implements OnInit {
  microDonationData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService

  ) {
    this.getRahatokarshList();
  }

  ngOnInit(): void {
  }
  getRahatokarshList() {
    this.homeService.getMicroDonation().subscribe((res: any) => {
      this.microDonationData = res;
      for (let i = 0; i < this.microDonationData.length; i++) {
        this.microDonationData[i].index = i + 1;
      }
      this.collectionSize = this.microDonationData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.microDonationData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  generatePDF() {
    let docDefinition = {
      header: 'C#Corner PDF Header',
      content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
