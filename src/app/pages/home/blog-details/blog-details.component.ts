import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  blogsData: any = [];
  bDetails: any = {};
  blogId: any;
  
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.blogId = params['id'];
      this.getBlogDetails();
    });
  }

  ngOnInit(): void {
  }
  getBlogDetails() {
    this.homeService.getBlogsById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.blogsData = res;
      this.bDetails = {};
      this.blogsData.forEach((element: any) => {
        if (element.id == this.blogId) {
          this.bDetails = element;
        }
      });
    })
  }
}
