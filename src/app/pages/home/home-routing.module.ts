import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumniListComponent } from './alumni-list/alumni-list.component';
import { AnswerKeyComponent } from './answer-key/answer-key.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogComponent } from './blog/blog.component';
import { CollegeListComponent } from './college-list/college-list.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { CounselingComponent } from './counseling/counseling.component';
import { DepartmentComponent } from './department/department.component';
import { DonationBulkUploadComponent } from './donation-bulk-upload/donation-bulk-upload.component';
import { DonationComponent } from './donation/donation.component';
import { GatePassComponent } from './gate-pass/gate-pass.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { InfraDetailsComponent } from './infra-details/infra-details.component';
import { InfrastructureComponent } from './infrastructure/infrastructure.component';
import { MagazineComponent } from './magazine/magazine.component';
import { MicroDonationComponent } from './micro-donation/micro-donation.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { MoreComponent } from './more/more.component';
import { NewsComponent } from './news/news.component';
import { OthersComponent } from './others/others.component';
import { QuestionPapersComponent } from './question-papers/question-papers.component';
import { RahotkarshBulkUploadComponent } from './rahotkarsh-bulk-upload/rahotkarsh-bulk-upload.component';
import { RahotkarshComponent } from './rahotkarsh/rahotkarsh.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentResultComponent } from './student-result/student-result.component';
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
import { DesignTokenComponent } from './design-token/design-token.component';

const routes: Routes = [
  {
    path: 'image-upload',
    component: ImageUploadComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'staff-details',
    component: StaffDetailsComponent
  },
  {
    path: 'student-details',
    component: StudentDetailsComponent
  },
  {
    path: 'others',
    component: OthersComponent
  },
  {
    path: 'result',
    component: StudentResultComponent
  },
  {
    path: 'infrastructure',
    component: InfrastructureComponent
  },
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'college-list',
    component: CollegeListComponent
  },
  {
    path: 'department',
    component: DepartmentComponent
  },
  {
    path: 'donation',
    component: DonationComponent
  },
  {
    path: 'rahotkarsh',
    component: RahotkarshComponent
  },
  {
    path: 'rahotkarsh-bulk',
    component: RahotkarshBulkUploadComponent
  },
  {
    path: 'donation-bulk',
    component: DonationBulkUploadComponent
  },
  {
    path: 'alumni-list',
    component: AlumniListComponent
  },
  {
    path: 'contact-list',
    component: ContactListComponent
  },
  {
    path: 'details/:id',
    component: BlogDetailsComponent
  },
  {
    path: 'infra-details/:id',
    component: InfraDetailsComponent
  },
  {
    path: 'magazine',
    component: MagazineComponent
  },
  {
    path: 'counseling',
    component: CounselingComponent
  },
  {
    path: 'more',
    component: MoreComponent
  },
  {
    path: 'more-details/:id',
    component: MoreDetailsComponent
  },
  {
    path: 'papers',
    component: QuestionPapersComponent
  },
  {
    path: 'gate-pass',
    component: GatePassComponent
  },
  {
    path: 'answer-key',
    component: AnswerKeyComponent
  },
  {
    path: 'micro-donation',
    component: MicroDonationComponent
  },
  {
    path: 'naac',
    component: NaacMainComponent
  },
  {
    path: 'naac-view/:id',
    component: NaacViewComponent
  },
  {
    path: 'link-generater',
    component: LinkGeneratorComponent
  },
  {
    path: 'committee',
    component: CommiteeComponent
  },
  {
    path: 'comm-details/:id',
    component: CommDetailsComponent
  },
  {
    path: 'placement',
    component: PlacementCellComponent
  },
  {
    path: 'placement-details/:id',
    component: PlacementDetailsComponent
  },
  {
    path: 'research',
    component: ResearchComponent
  },
  {
    path: 'research-details/:id',
    component: ResearchDetailsComponent
  },
  {
    path: 'campus',
    component: CampusLifeComponent
  },
  {
    path: 'campus-details/:id',
    component: CampusDetailsComponent
  },
  {
    path: 'photo-contest',
    component: PhotoContestComponent
  },
  {
    path: 'contest-images',
    component: PhotoContestImagesComponent
  },
  {
    path: 'syllabus',
    component: SyllabusComponent
  },
  {
    path: 'syllabus-details/:id',
    component: SyllaDetailsComponent
  },
  {
    path: 'admission',
    component: AdmissionComponent
  },
  {
    path: 'dep-details/:id',
    component: DepartmentDetailsComponent
  },
  {
    path: 'design-token',
    component: DesignTokenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }
