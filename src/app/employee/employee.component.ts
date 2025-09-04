import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from './employee.model';
import { Role } from '../role/role.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  // use `any[]` to be flexible while mapping server shapes
  employees: any[] = [];
  roles: any[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    // load roles first so dropdown has values when employees are rendered
    this.loadRoles();
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.map((emp: any) => ({
          ...emp,
          roleId: emp.roleId ?? emp.RoleId ?? 0,  // 👈 normalize roleId
          roleName: emp.roleName ?? ''   // 👈 use directly if API sends it
        }));
        console.log('Employees with roleId:', this.employees);
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  loadRoles(): void {
    this.employeeService.getRoles().subscribe({
      next: (data: Role[]) => {
        // normalize role id field from whatever server returns
        this.roles = data.map(r => ({
          ...r,
          roleId: r.roleId ?? r.roleId ?? Number(r.roleId)
        }));
        console.log('Roles loaded:', this.roles);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  onEdit(emp: Employee): void {
    this.employeeService.updateEmployee(emp.id, emp).subscribe({
      next: () => {
        console.log('Updated Successfully');
        this.getEmployees();
      },
      error: (err) => console.error('Error updating:', err)
    });
  }

  onDelete(id: number): void {
    if (!confirm('Are you sure to delete this employee?')) return;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Deleted Successfully');
        this.getEmployees();
      },
      error: (err) => console.error('Error deleting:', err)
    });
  }
  onRoleChange(employee: any): void {
    if (employee.roleId) {
      this.employeeService.assignRole(employee.employeeId, employee.roleId).subscribe({
        next: () => {
          console.log(`Role assigned: empId=${employee.employeeId}, roleId=${employee.roleId}`);
        },
        error: (err) => {
          console.error('Error assigning role:', err);
        }
      });
    }
  }


  assignRole(emp: any): void {
    // emp.roleId already normalized to number | null
    const roleId = emp.roleId ?? emp.RoleId ?? null;
    if (roleId === null || roleId === undefined || roleId === '') {
      alert('Please select a role first!');
      return;
    }

    // ensure number type
    const numericRoleId = Number(roleId);

    this.employeeService.assignRole(emp.id, numericRoleId).subscribe({
      next: () => {
        alert('Role assigned successfully!');
        this.getEmployees(); // refresh to reflect assigned role
      },
      error: (err) => {
        console.error('Error assigning role:', err);
        alert('Something went wrong while assigning role.');
      }
    });
  }
}
