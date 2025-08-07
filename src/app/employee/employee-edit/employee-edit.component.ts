import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../employee.model';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // ✅ Initialize form group inside constructor or ngOnInit
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      dateOfJoining: ['', Validators.required]   // 🔁 Renamed to match HTML
    });

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      this.employeeId = id;

      this.employeeService.getEmployee(id).subscribe((employee) => {
        if (employee) {
          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            department: employee.department,         // ✅ Must be present
            joiningDate: employee.dateOfJoining        // ✅ Must be present
          });
        }
      });
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.employeeId = +idParam;
        this.loadEmployee();
      }
    });
  }

  loadEmployee(): void {
    this.employeeService.getEmployee(this.employeeId).subscribe((emp) => {
      // ✅ Convert ISO datetime to only yyyy-MM-dd
      const formattedEmployee = {
        ...emp,
        dateOfJoining: emp.dateOfJoining?.slice(0, 10) || ''
      };

      this.employeeForm.patchValue(formattedEmployee);
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
