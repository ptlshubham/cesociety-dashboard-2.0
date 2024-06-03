import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { RequestTokensComponent } from './request-tokens/request-tokens.component';
import { ClientsComponent } from './clients/clients.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ProfileComponent } from './profile/profile.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { PostingComponent } from './posting/posting.component';
import { MonthlyWorkComponent } from './monthly-work/monthly-work.component';

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent
  },
  {
    path: 'request-tokens',
    component: RequestTokensComponent
  },
  {
    path: 'clients',
    component: ClientsComponent
  },
  {
    path: 'todo-list',
    component: TodoListComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'attendance',
    component: AttendanceComponent
  },
  {
    path: 'posting',
    component: PostingComponent
  },
  {
    path: 'monthly-report',
    component: MonthlyWorkComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CompanyRoutingModule { }
