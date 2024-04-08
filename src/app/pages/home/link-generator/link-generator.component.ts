import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/core/services/home.services';
import { SortableNaacDirective } from './datatable-sortableNaac.directive';
import { TableNaac } from './datatable.model';
import { naacData } from './linkData';
import { DataTableNaacService } from './link.services';

@Component({
  selector: 'app-link-generator',
  templateUrl: './link-generator.component.html',
  styleUrls: ['./link-generator.component.scss'],

})
export class LinkGeneratorComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;
  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  removeUpload: boolean = false;
  cardImageBase64: any;
  staffProfileImage: any = null;
  isOpen: boolean = false;
  isUpdate: boolean = false;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  LinkData: any = [];
  pdfResponse: any = '';
  progressValue: number = 0; // Variable to track the progress value
  progressType: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress: boolean = false;
  subList: any = [];
  subtosubList: any = [];
  pdfResponse1: any = '';
  progressValue1: number = 0; // Variable to track the progress value
  progressType1: string = 'success'; // Type of progress bar (success, info, warning, danger)
  isProgress1: boolean = false;

  LinkDetailsModel: any = {
  };

  // For Select Dropdown with new entry
  criteria = [
    { name: 'Criteria 1' },
    { name: 'Criteria 2' },
    { name: 'Criteria 3' },
    { name: 'Criteria 4' },
    { name: 'Criteria 5' },
    { name: 'Criteria 6' },
    { name: 'Criteria 7' },
    { name: 'SSR' },
    { name: 'AQAR' },
    { name: 'Extended Profile of College' },
    { name: 'Other Documents' },
    { name: 'Slider News' }

  ];

  subMenuList: any = [];
  subToSubMenu: any = [];
  srNumber = [];
  selectedCriteria: any;
  subMenu: any;
  subToSub: any;
  naacData: any = [];

  @ViewChildren(SortableNaacDirective)
  headers!: QueryList<SortableNaacDirective>;
  tableData!: TableNaac[];
  hideme: boolean[] = [];
  tables$: Observable<TableNaac[]>;
  total$: Observable<number>;

  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    public service: DataTableNaacService,

  ) {
    this.getAllLinkDetails();
    this.tables$ = this.service.table$;
    this.total$ = this.service.totals$;
  }

  ngOnInit(): void {
    this.validationForm = this.formBuilder.group({
      // criteria: ['', Validators.required],
      // subMenu: ['', Validators.required],
      paraname: ['', Validators.required]
    });
    this._fetchData();

  }
  get f() { return this.validationForm.controls; }

  openAddNAACDetails() {
    this.isOpen = true;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.subMenu = {};
    this.subToSub = {};
    this.LinkDetailsModel = {};
    this.progressValue = 0;
    this.progressValue1 = 0;
    this.isProgress = false;
    this.isProgress1 = false;
    this.getGroupSubMenuDetails();
    this.getGroupSubToSubDetails();
    this.validationForm.markAsUntouched();

  }
  backToList() {
    this.isOpen = false;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.subMenu = {};
    this.subToSub = {};
    this.LinkDetailsModel = {};
    this.progressValue = 0;
    this.progressValue1 = 0;
    this.isProgress = false;
    this.isProgress1 = false;
    this.validationForm.markAsUntouched();


  }
  uploadParameterPdfFile(event: any) {
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
  uploadAttachmentPdfFile(event: any) {
    this.isProgress1 = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file form control
      reader.onload = () => {
        const formdata = new FormData();
        formdata.append('file', file);
        // Reset progress bar
        this.progressValue1 = 0;
        this.progressType1 = 'success';
        this.homeService.savePdfData(formdata).subscribe((response) => {
          this.toastr.success('File uploaded successfully.', 'Success', { timeOut: 3000 });
          this.pdfResponse1 = response;
        }, (error) => {
          this.toastr.error('File upload failed.', 'Error', { timeOut: 3000 });
          this.progressType1 = 'danger';
        }, () => {
          this.progressValue1 = 100; // Set progress bar to 100% when upload is complete
        });
      };
    }
  }
  // For Add New Items
  addSubMenu(term: string): any {
    return { subMenu: term };
  }
  addSubToSub(term: string): any {
    return { subToSub: term };
  }

  // For changing onevent
  onCriteriaChange(event: any) {
    this.selectedCriteria = event.name;
  }
  onSubMenuChange(event: any) {
    this.subMenu = event.subMenu
  }
  onSubToSubMenuChange(event: any) {
    this.subToSub = event.subToSub
  }
  saveLinkDetails() {
    this.LinkDetailsModel.criteria = this.selectedCriteria;
    this.LinkDetailsModel.institute_id = localStorage.getItem('InstituteId');
    this.LinkDetailsModel.subMenu = this.subMenu;
    this.LinkDetailsModel.subToSub = this.subToSub;
    this.LinkDetailsModel.paralink = this.pdfResponse;
    this.homeService.saveNaacLinkDetails(this.LinkDetailsModel).subscribe((res: any) => {
      this.naacData = res;
      this.LinkDetailsModel = {};
      this.selectedCriteria = {};
      this.subMenu = {};
      this.subToSub = {};
      this.pdfResponse = '';
      this.pdfResponse1 = '';
      this.isProgress = false;
      this.isProgress1 = false;
      this.progressValue = 0;
      this.progressValue1 = 0;
      this.getAllLinkDetails();
      this.getGroupSubMenuDetails();
      this.getGroupSubToSubDetails();
      this.validationForm.markAsUntouched();
      this.toastr.success('NAAC Details added Successfully.', 'Saved', { timeOut: 3000, });
    })
  }

  getAllLinkDetails() {
    
    this.homeService.getNaacLinkDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.naacData = res;
      
      for (let i = 0; i < this.naacData.length; i++) {
        this.naacData[i].index = i + 1;
        if (this.naacData[i].subMenu === '[object Object]' && this.naacData[i].subMenu !== null) {
          this.naacData[i].subMenu = '';
        }
        if (this.naacData[i].subToSub === '[object Object]' && this.naacData[i].subToSub !== null) {
          this.naacData[i].subToSub = '';
        }
      }
      naacData.forEach((element, index) => {
        delete naacData[index];
      });
      naacData.length = 0;
      this.LinkData = res;
       
      this.LinkData.forEach((ele: any, ind: number) => {
        let data: any = {
          id:ele.id,
          srNo: ind + 1,
          criteria: ele.criteria,
          subMenu: ele.subMenu,
          subToSub: ele.subToSub,
          linkName: ele.linkName,
          link: ele.link,
          createddate: ele.createddate,
        }
        naacData.push(data);
      })
      // this.collectionSize = this.naacData.length;
      // this.getPagintaion();
      this.getGroupSubMenuDetails();
      this.getGroupSubToSubDetails();
    })
  }
  getPagintaion() {
    // this.paginateData = this.naacData
    //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  getGroupSubMenuDetails() {
    this.homeService.getSubMenuGroup(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      res.forEach((ele: any) => {
        if (ele.subMenu != '[object Object]' && ele.subMenu != null) {
          this.subMenuList.push(ele)
        }
      })

    })
  }
  getGroupSubToSubDetails() {
    this.homeService.getSubToSubMenuGroup(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      
      res.forEach((ele: any) => {
        if (ele.subToSub != '[object Object]' && ele.subToSub != null) {
          this.subToSubMenu.push(ele);
        }
      })
    })
  }
  openNaacDetails(data: any) {
    this.LinkDetailsModel = data;
    if (data.attachname != 'undefined') {
      this.LinkDetailsModel.attachname = data.attachname;
    }
    else {
      this.LinkDetailsModel.attachname = '';
    }
    if (data.paralink != 'undefined') {
      this.LinkDetailsModel.paralink = data.paralink;
    }
    else {
      this.LinkDetailsModel.paralink = null;
    }
    if (data.attachlink != 'undefined') {
      this.LinkDetailsModel.attachlink = data.attachlink;
    }
    else {
      this.LinkDetailsModel.attachlink = null;
    }
    this.selectedCriteria = data.criteria;
    this.subMenu = data.keyno;
    this.isUpdate = true;
    this.isOpen = true;
  }
  // updateNaacDetails() {
  //   this.LinkDetailsModel.criteria = this.selectedCriteria;
  //   this.LinkDetailsModel.keyno = this.subMenu;
  //   if (this.pdfResponse != '' && this.pdfResponse != 'undefined') {
  //     this.LinkDetailsModel.paralink = this.pdfResponse;
  //   }
  //   else {
  //     this.LinkDetailsModel.paralink
  //   }
  //   if (this.pdfResponse1 != '' && this.pdfResponse1 != 'undefined') {
  //     this.LinkDetailsModel.attachlink = this.pdfResponse1;
  //   }
  //   else {
  //     this.LinkDetailsModel.attachlink
  //   }
  //   this.homeService.updateNAACData(this.LinkDetailsModel).subscribe((res: any) => {
  //     this.naacData = res;
  //     this.toastr.success('NAAC Crietria Updated Successfully', 'Updated', {
  //       timeOut: 3000,
  //     });
  //     this.validationForm.markAsUntouched();
  //     this.getAllNAACDetails();
  //   })
  // }
  removeLinkDetails(id: any) {
    
    this.homeService.removeNaacLink(id).subscribe((res: any) => {
      this.naacData = res;
      this.toastr.success('NAAC Crietria Deleted Successfully', 'Removed', {
        timeOut: 3000,
      });
      this.isUpdate = false;
      this.isOpen = false;
      this.getAllLinkDetails();
    })
  }

  _fetchData() {
    this.tableData = this.tableData;
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSortNaac({ columnNaac, direction }: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortableNaac !== columnNaac) {
        header.direction = '';
      }
    });
    this.service.sortColumn = columnNaac;
    this.service.sortDirection = direction;
  }

}
