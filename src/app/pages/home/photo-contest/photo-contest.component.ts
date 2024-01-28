import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-photo-contest',
  templateUrl: './photo-contest.component.html',
  styleUrls: ['./photo-contest.component.scss']
})
export class PhotoContestComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  contestData: any = [];

  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.getPhotoContest();
  }
  getPhotoContest() {
    this.homeService.getPhotoContestData().subscribe((res: any) => {
      this.contestData = res;
      for (let i = 0; i < this.contestData.length; i++) {
        this.contestData[i].index = i + 1;
      }
      this.collectionSize = this.contestData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.contestData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  removeContestDetails(id: any) {
    this.homeService.removeContestDetails(id).subscribe((res: any) => {
      this.contestData = res;
      this.toastr.success('Photo Contest Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getPhotoContest();
    })
  }
  viewContestImagesDetails(obj: any) {
    let data = {
      id: obj.id,
      image: obj.image
    }
    this.router.navigate(['contest-images/'], {
      queryParams: {
        data: JSON.stringify(data)
      }
    });
  }
}
