import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Router } from '@angular/router';
import { DepartmentService } from '../../department/department.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  departments: any[] = []; // will hold department list

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfJoining: ['', Validators.required],
    });
    this.loadDepartments(); 
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res; 
      },
      error: (res) => {
        console.error('Error fetching departments', res);
      }
    });
  }

  onSubmit(): void {
  if (this.employeeForm.valid) {
    const employeeData = {
      id: 0, // 👈 always 0 when adding
      name: this.employeeForm.value.name,
      email: this.employeeForm.value.email,
      departmentId: Number(this.employeeForm.value.departmentId), // ✅ ensure number
      dateOfJoining: new Date(this.employeeForm.value.dateOfJoining).toISOString()
    };

    console.log("🚀 Employee Data to send:", employeeData); // 👈 DEBUG

    this.employeeService.addEmployee(employeeData).subscribe({
      next: () => {
        alert('Employee added successfully!');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('❌ Error adding employee:', err);
        alert('Something went wrong!');
      },
    });
  } else {
    this.employeeForm.markAllAsTouched();
  }
}


  onCancel() {
    this.router.navigate(['/employees']); // go back to employee list
  }
}
