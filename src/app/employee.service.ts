import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee/employee.model';
import { Role } from './role/role.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5156/api/Employees';
    private roleUrl = 'http://localhost:5156/api/Roles';

  // adjust your API url

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.roleUrl);
  }

  assignRole(employeeId: number, roleId: number) {
    return this.http.put<void>(`${this.apiUrl}/${employeeId}/assign-role?roleId=${roleId}`, {});
  }
}
