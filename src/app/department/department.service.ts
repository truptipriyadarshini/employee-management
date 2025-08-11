import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  // set this to your actual API base url
  private apiUrl = 'http://localhost:5156/api/Department';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  addDepartment(dept: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, dept);
  }

  updateDepartment(id: number, dept: Department): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dept);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
