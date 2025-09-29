import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../services/admin-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AdminUserUI {
  id: string;
  email: string;
  validated: boolean;
  role: 'USER' | 'ADMIN';
  roleUI: boolean; // true if ADMIN, false if USER
  updatingRole?: boolean; // optional flag for optimistic update
}

@Component({
  selector: 'app-admin-user-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-validation.html',
  styleUrls: ['./admin-user-validation.css']
})
export class AdminUserValidation implements OnInit {
  users: AdminUserUI[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(private adminUserService: AdminUser) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminUserService.getAllUsers().subscribe({
      next: (data) => {
        // Map backend roles to UI roles
        this.users = data.map(u => ({
          ...u,
          roleUI: u.role === 'ADMIN'
        }));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to load users.';
        this.loading = false;
      }
    });
  }

  validate(userId: string): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.adminUserService.validateUser(userId).subscribe({
      next: (res) => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.validated = true;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to validate user.';
      }
    });
  }

  toggleRole(user: AdminUserUI): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Optimistic UI: flip role immediately
    const previousRole = user.roleUI;
    user.roleUI = !user.roleUI;
    user.updatingRole = true;

    const newRole = user.roleUI ? 'admin' : 'user';

    this.adminUserService.changeRole(user.id, newRole).subscribe({
      next: (res) => {
        // sync backend role
        user.role = user.roleUI ? 'ADMIN' : 'USER';
        this.successMessage = res.message || `Role updated to ${user.role}`;
        user.updatingRole = false;
      },
      error: () => {
        // rollback on failure
        user.roleUI = previousRole;
        this.errorMessage = '⚠️ Failed to change role.';
        user.updatingRole = false;
      }
    });
  }
}
