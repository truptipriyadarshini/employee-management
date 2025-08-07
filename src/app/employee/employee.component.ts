import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from './employee.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [CommonModule,RouterModule],
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees(); // Call method on component load
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        console.log('Employees loaded:', this.employees); // ✅ Debug
      },
      error: (err) => {
        console.error('Error fetching employees:', err); // ❌ If any error
      },
    });
  }
  onEdit(emp: Employee): void {
    this.employeeService.updateEmployee(emp.id, emp).subscribe({
      next: () => {
        console.log('Updated Succesfully');
        this.getEmployees();
      },
      error: (err) => {
        console.error('Error updating:', err);
      }
    })
  }
  onDelete(id: number): void {
    if (confirm('Are you sure to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log('Deleted Succesfully');
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error deleting:', err);
        },
      })
    }
  }
}
