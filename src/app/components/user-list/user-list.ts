import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../Models/user-dto.model';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  searchEmail = '';
  private emailSearchTimeout: any;

  minAmount = 0;
  maxAmount = 5000;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
  if (this.searchEmail.trim()) {
    this.userService.searchUsersCombined(this.searchEmail.trim(), this.maxAmount, this.currentPage, this.pageSize)
      .subscribe({
        next: (pageData) => this.updateUsers(pageData),
        error: () => this.errorMessage = 'Erreur lors de la recherche combinée.'
      });
  } else {
    this.userService.getUsersByMaxAmount(this.maxAmount, this.currentPage, this.pageSize)
      .subscribe({
        next: (pageData) => this.updateUsers(pageData),
        error: () => this.errorMessage = 'Erreur lors de la recherche par montant.'
      });
  }
}

  private updateUsers(pageData: any): void {
    this.users = pageData.content;
    this.totalPages = pageData.totalPages;
    // If backend returns totalElements < pageSize, we may still want at least 1 page
    if (this.totalPages === 0 && this.users.length > 0) {
      this.totalPages = 1;
    }
  }

  onEmailChange(): void {
    clearTimeout(this.emailSearchTimeout);
    this.emailSearchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadUsers();
    }, 250); 
  }

  onAmountChange(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  viewUser(userId: string): void {
    this.router.navigate(['/users', userId, 'stream']);
  }
}
