import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../employee.model';
import { DepartmentService } from '../../department/department.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  departments: { departmentId: number, departmentName: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentId: ['', Validators.required],
      dateOfJoining: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load departments
    this.departmentService.getDepartments().subscribe((data) => {
      this.departments = data;
    });

    // Get employee id from route and load details
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.employeeId = +idParam;
        this.employeeService.getEmployeeById(this.employeeId).subscribe((employee) => {
          if (employee) {
            this.employeeForm.patchValue({
              name: employee.name,
              email: employee.email,
              departmentId: employee.departmentId,
              dateOfJoining: employee.dateOfJoining
            });
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const updatedEmployee: Employee = {
        id: this.employeeId,
        ...this.employeeForm.value,
      };

      this.employeeService.updateEmployee(this.employeeId, updatedEmployee).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
