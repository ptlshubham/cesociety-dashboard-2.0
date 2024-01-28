import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  @Input() fileContent: any;

  isopen: boolean = false;
  isUpdate: boolean = false;

  public Editor = ClassicEditor;
  blogsData: any = [];

  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = "assets/images/file-upload-image.jpg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  cardImageBase64: any;
  blogImages: any;
  blogModel: any = {};
  fileUrl: any;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    private datepipe: DatePipe,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.getBlogDetails();
  }
  openAddBlog() {
    this.isopen = true;
  }
  closeAddBlog() {
    this.isopen = false;

  }
  uploadFile(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        const imgBase64Path = reader.result;
        this.cardImageBase64 = imgBase64Path;
        const formdata = new FormData();
        formdata.append('file', file);


        this.homeService.uploadBlogImage(formdata).subscribe((response) => {
          this.blogImages = response;
          this.toastr.success('Blog image uploaded Successfully.', 'Uploaded', { timeOut: 3000, });

          this.editFile = false;
          this.removeUpload = true;
        })
      }
    }
  }
  saveBlogData() {
    // this.createTextFile(this.blogModel.blogDetails, 'Blog' + '.txt', 'text/plain');

    this.blogModel.institute_id = localStorage.getItem('InstituteId')
    this.blogModel.blogImage = this.blogImages;

    this.homeService.saveBlogDetails(this.blogModel).subscribe((res) => {
      this.blogsData = res;
      this.toastr.success('Blog saved Successfully.', 'Saved', { timeOut: 3000, });
      this.getBlogDetails();
      this.isopen = false;
    })
  }
  editBlogDetails(data: any) {
    this.blogModel = data;
    this.blogModel.blogDate = this.datepipe.transform(data.blogDate, 'yyyy-MM-dd');
    this.imageUrl = 'https://api.cesociety.in' + data.blogImage
    this.isopen = true;
    this.isUpdate = true;

  }
  updateBlog() {
    if (this.blogImages != null || undefined) {
      this.blogModel.blogImage = this.blogImages;
    }
    this.homeService.updateBlogDetails(this.blogModel).subscribe((res: any) => {
      this.blogsData = res;
      this.toastr.success('Blog Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getBlogDetails();
      this.isopen = false;
      this.isUpdate = false;
    })
  }

  getBlogDetails() {
    this.homeService.getBlogsById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.blogsData = res;
      for (let i = 0; i < this.blogsData.length; i++) {
        this.blogsData[i].index = i + 1;
      }
      this.collectionSize = this.blogsData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.blogsData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewBlogDetails(id: any) {
    this.router.navigate(['/details', id]);
  }
  removeBlogById(id: any) {
    this.homeService.removeBlog(id).subscribe((res: any) => {
      this.blogsData = res;
      this.toastr.success('Blog Successfully deleted.', 'Removed', { timeOut: 3000, });
      this.getBlogDetails();
    })
  }
}
