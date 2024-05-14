import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee.component';
import { CompanyRoutingModule } from './company-routing';
import { CountUpModule } from 'ngx-countup';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { NgbDropdownModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsComponent } from './clients/clients.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EmployeeComponent,
    CompanyDashboardComponent,
    ClientsComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    CountUpModule,
    NgbToastModule,
    NgbTooltipModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgSelectModule

  ],
  exports: [
    CompanyDashboardComponent,
    EmployeeComponent,

  ]
})
export class CompanyModule { }
