import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { RequestTokensComponent } from './request-tokens/request-tokens.component';
import { ClientsComponent } from './clients/clients.component';

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent
  },
  {
    path: 'request-tokens',
    component: RequestTokensComponent
  }, {
    path: 'clients',
    component: ClientsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CompanyRoutingModule { }
