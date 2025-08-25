import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, RoleService } from './role.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
declare var bootstrap: any;
@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgForOf,NgIf],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleForm!: FormGroup;
  editingRole: any = null;
  selectedRoleId: number | null = null;

  constructor(private roleservice: RoleService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadRoles();

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    });
    
  }
  loadRoles() {
    this.roleservice.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error loading roles:', err)
    })
  }
  openModel() {
    this.editingRole = null;
    this.selectedRoleId = null;
    this.roleForm.reset({ roleId: 0, roleName: '' });
  }
  openEditModal(role: any) {
    this.editingRole = true;
    this.selectedRoleId = role.roleId;
    this.roleForm.patchValue(role);
  }
  saveRole() {
    if (this.roleForm.invalid) return;
    const roleData: Role = {
      roleId: this.selectedRoleId ?? 0,
      roleName: this.roleForm.value.roleName
    };

    if (this.editingRole && this.selectedRoleId) {
      this.roleservice.updateRole(roleData).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => console.error('Error updating role:', err)
      });
    }
    else {
      this.roleservice.addRole(roleData).subscribe({
        next: () => {
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => console.error('Error adding role:', err)
      });
    }
  }
  deleteRole(id: number) {
    if (confirm('Are you sure to delete this role?')) {
      this.roleservice.deleteRole(id).subscribe({
        next: () => this.loadRoles(),
        error: (err) => console.error('Error deleting role:', err)
      });
    }
  }

  closeModal() {
    const modalElement = document.getElementById('roleModal');
    const modal = bootstrap.Modal.getInstance(modalElement!) || new bootstrap.Modal(modalElement!);
    modal.hide();
  }
}
