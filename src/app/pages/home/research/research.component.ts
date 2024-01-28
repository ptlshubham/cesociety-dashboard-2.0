import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {

  public Editor = ClassicEditor;
  researchData: any = [];
  researchModel: any = {};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.val++;
    this.getResearchDataById();
  }
  openAddRes() {
    this.researchModel = {};
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddRes() {
    this.isOpen = false;
    this.isUpdate = false;
  }
 
 
  saveResearchDetails() {
    this.researchModel.institute_id = localStorage.getItem('InstituteId');
    this.homeService.saveResearchDetails(this.researchModel).subscribe((res: any) => {
      this.researchData = res;
      this.toastr.success('Research Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getResearchDataById();
    })
  }
 
  editResearchDetails(data: any) {
    this.researchModel = data;
    // this.getResearchMultiImage(data.id);
    this.isOpen = true;
    this.isUpdate = true;
  }
  updateResearchDetails() {
    this.homeService.updateResearchDetails(this.researchModel).subscribe((res: any) => {
      this.researchData = res;
      this.toastr.success('Research Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getResearchDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removeResearchById(id: any) {
    this.homeService.removeResearchById(id).subscribe((res: any) => {
      this.researchData = res;
      this.toastr.success('Research Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getResearchDataById();
    })
  }
  getResearchDataById() {
    this.homeService.getResearchDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.researchData = res;
      for (let i = 0; i < this.researchData.length; i++) {
        this.researchData[i].index = i + 1;
      }
      this.collectionSize = this.researchData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.researchData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewResearchDetails(id: any) {
    this.router.navigate(['/research-details', id]);
  }

}
