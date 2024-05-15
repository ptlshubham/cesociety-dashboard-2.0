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
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/shared/shared.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import { ClientsComponent } from './clients/clients.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TodoListComponent } from './todo-list/todo-list.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    CompanyDashboardComponent,
    RequestTokensComponent,
    ClientsComponent,
    TodoListComponent,
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
    NgSelectModule,
    NgApexchartsModule,

    FullCalendarModule,



  ],
  exports: [
    CompanyDashboardComponent,
    EmployeeComponent,


  ]
})
export class CompanyModule { }
