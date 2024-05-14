import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee.component';
import { CompanyRoutingModule } from './company-routing';
import { CountUpModule } from 'ngx-countup';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { NgbDropdownModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestTokensComponent } from './request-tokens/request-tokens.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { ClientsComponent } from './clients/clients.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EmployeeComponent,
    CompanyDashboardComponent,
    RequestTokensComponent,
    ClientsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule,
    CountUpModule,
    NgbToastModule,
    NgbTooltipModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    CKEditorModule,
    NgSelectModule

  ],
  exports: [
    CompanyDashboardComponent,
    EmployeeComponent,

  ]
})
export class CompanyModule { }
