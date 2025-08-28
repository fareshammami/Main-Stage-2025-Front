import { Component, OnInit } from '@angular/core';
import { AdminUser } from '../../services/admin-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-validation.html',
  styleUrls: ['./admin-user-validation.css']
})
export class AdminUserValidation implements OnInit {
  users: any[] = [];
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
      next: data => {
        this.users = data;
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
      next: res => {
        this.successMessage = res.message || '✅ User validated.';
        const user = this.users.find(u => u.id === userId);
        if (user) user.validated = true;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to validate user.';
      }
    });
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'ADMIN' ? 'user' : 'admin';
    this.adminUserService.changeRole(user.id, newRole).subscribe({
      next: res => {
        user.role = newRole.toUpperCase();
        this.successMessage = res.message;
      },
      error: () => {
        this.errorMessage = '⚠️ Failed to change role.';
      }
    });
  }
}
