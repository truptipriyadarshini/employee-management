import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from './department.model';
import { DepartmentService } from './department.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  departmentForm: FormGroup;
  isEdit = false;
  editingId: number | null = null;

  // reference to the modal element (#departmentModal in template)
  @ViewChild('departmentModal') modalRef!: ElementRef;
  private modalInstance: any;

  constructor(private fb: FormBuilder, private departmentService: DepartmentService) {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  // load list from API
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data: Department[]) => this.departments = data,
      error: err => console.error('Failed to load departments', err)
    });
  }

  // open add modal
  openAddModal(): void {
    this.isEdit = false;
    this.editingId = null;
    this.departmentForm.reset();
    this.showModal();
  }

  // open edit modal and patch form
  openEditModal(dept: Department): void {
    this.isEdit = true;
    this.editingId = dept.departmentId;
    this.departmentForm.patchValue({
      departmentName: dept.departmentName
    });
    this.showModal();
  }

  // save (create or update)
  saveDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const payload: Partial<Department> = {
      departmentName: this.departmentForm.value.departmentName
    };

    if (this.isEdit && this.editingId != null) {
      const dto: Department = {
        departmentId: this.editingId, departmentName: payload.departmentName!,
        name: undefined
      };
      this.departmentService.updateDepartment(this.editingId, dto).subscribe({
        next: () => { this.hideModal(); this.loadDepartments(); },
        error: err => console.error('Update failed', err)
      });
    } else {
      this.departmentService.addDepartment(payload).subscribe({
        next: () => { this.hideModal(); this.loadDepartments(); },
        error: err => console.error('Create failed', err)
      });
    }
  }

  // delete
  deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) return;
    this.departmentService.deleteDepartment(id).subscribe({
      next: () => { this.departments = this.departments.filter(d => d.departmentId !== id); },
      error: err => console.error('Delete failed', err)
    });
  }

  // modal show/hide using bootstrap JS
  private showModal(): void {
    if (!this.modalInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.modalInstance = new (window as any).bootstrap.Modal(this.modalRef.nativeElement);
    }
    this.modalInstance.show();
  }

  hideModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  // helper for template
  get f() {
    return this.departmentForm.controls;
  }

}
