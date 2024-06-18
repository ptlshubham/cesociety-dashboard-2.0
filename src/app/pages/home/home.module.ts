import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { HomeRoutingModule } from './home-routing.module';
import { NewsComponent } from './news/news.component';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { OthersComponent } from './others/others.component';
import { StudentResultComponent } from './student-result/student-result.component';
import { InfrastructureComponent } from './infrastructure/infrastructure.component';
import { BlogComponent } from './blog/blog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CollegeListComponent } from './college-list/college-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from './department/department.component';
import { NgbAccordionModule, NgbAlertModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DonationComponent } from './donation/donation.component';
import { RahotkarshComponent } from './rahotkarsh/rahotkarsh.component';
import { RahotkarshBulkUploadComponent } from './rahotkarsh-bulk-upload/rahotkarsh-bulk-upload.component';
import { DonationBulkUploadComponent } from './donation-bulk-upload/donation-bulk-upload.component';
import { AlumniListComponent } from './alumni-list/alumni-list.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ToastrModule } from 'ngx-toastr';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { InfraDetailsComponent } from './infra-details/infra-details.component';
import { MagazineComponent } from './magazine/magazine.component';
import { CounselingComponent } from './counseling/counseling.component';
import { MoreComponent } from './more/more.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { QuestionPapersComponent } from './question-papers/question-papers.component';
import { GatePassComponent } from './gate-pass/gate-pass.component';
import { AnswerKeyComponent } from './answer-key/answer-key.component';
import { MicroDonationComponent } from './micro-donation/micro-donation.component';
import { NaacComponent } from './naac/naac.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LinkGeneratorComponent } from './link-generator/link-generator.component';
import { CommiteeComponent } from './commitee/commitee.component';
import { CommDetailsComponent } from './comm-details/comm-details.component';
import { PlacementCellComponent } from './placement-cell/placement-cell.component';
import { PlacementDetailsComponent } from './placement-details/placement-details.component';
import { ResearchComponent } from './research/research.component';
import { ResearchDetailsComponent } from './research-details/research-details.component';
import { NaacMainComponent } from './naac-main/naac-main.component';
import { CampusLifeComponent } from './campus-life/campus-life.component';
import { CampusDetailsComponent } from './campus-details/campus-details.component';
import { PhotoContestComponent } from './photo-contest/photo-contest.component';
import { PhotoContestImagesComponent } from './photo-contest-images/photo-contest-images.component';
import { NaacViewComponent } from './naac-view/naac-view.component';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { SyllaDetailsComponent } from './sylla-details/sylla-details.component';
import { AdmissionComponent } from './admission/admission.component';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { MarketingPromotionsComponent } from './marketing-promotions/marketing-promotions.component';
import { DesignTokenComponent } from './design-token/design-token.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 5000000,
  acceptedFiles: 'pdf*'
};


@NgModule({
  declarations: [
    ImageUploadComponent,
    NewsComponent,
    StaffDetailsComponent,
    StudentDetailsComponent,
    OthersComponent,
    StudentResultComponent,
    InfrastructureComponent,
    BlogComponent,
    CollegeListComponent,            
    DepartmentComponent,
    DonationComponent,
    RahotkarshComponent,
    RahotkarshBulkUploadComponent,
    DonationBulkUploadComponent,
    AlumniListComponent,
    ContactListComponent,
    BlogDetailsComponent,
    InfraDetailsComponent,
    MagazineComponent,
    CounselingComponent,
    MoreComponent,
    MoreDetailsComponent,
    QuestionPapersComponent,
    GatePassComponent,
    AnswerKeyComponent,
    MicroDonationComponent,
    NaacComponent,
    LinkGeneratorComponent,
    CommiteeComponent,
    CommDetailsComponent,
    PlacementCellComponent,
    PlacementDetailsComponent,
    ResearchComponent,
    ResearchDetailsComponent,
    NaacMainComponent,
    CampusLifeComponent,
    CampusDetailsComponent,
    PhotoContestComponent,
    PhotoContestImagesComponent,
    NaacViewComponent,
    SyllabusComponent,
    SyllaDetailsComponent,
    AdmissionComponent,
    DepartmentDetailsComponent,
    MarketingPromotionsComponent,
    DesignTokenComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgbAlertModule,
    DropzoneModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbProgressbarModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbToastModule,
    NgSelectModule,
    NgbTypeaheadModule,
  ],
  providers: [
    DecimalPipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class HomeModule { }
