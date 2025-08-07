import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-add',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent {
employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfJoining: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe({
        next: () => {
          alert('Employee added successfully!');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert('Something went wrong!');
        },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
  onCancel() {
    this.router.navigate(['/employees/add']); // 👈 Navigate back to employee list
  }
}
