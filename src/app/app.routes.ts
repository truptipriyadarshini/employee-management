import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { DepartmentComponent } from './department/department.component';
import { RoleComponent } from './role/role.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeeComponent },
  { path: 'employees/add', component: EmployeeAddComponent },
  { path: 'employees/edit/:id', component: EmployeeEditComponent }, // ✅ Correct dynamic route
  { path: 'department', component: DepartmentComponent }, // ✅ Correct dynamic route
  { path: 'role', component: RoleComponent }, // ✅ Correct dynamic route
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
];

