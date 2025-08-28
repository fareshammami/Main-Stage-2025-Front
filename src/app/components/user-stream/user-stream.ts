import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-stream.html',
  styleUrls: ['./user-stream.css']
})
export class UserStreamComponent implements OnInit {

  userId: string = '';
  username: string = '';
  events: any[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;

  // Filters
  currentFilter = 'ALL';  
  selectedEventType = '';
  fromDate = '';
  toDate = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;

  // Embedded forms
  showAddIndu = false;
  showAddCompensation = false;

  newInduAmount: number | null = null;
  newCompensationAmount: number | null = null;

  // Form messages
  induErrorMessage = '';
  induSuccessMessage = '';
  compErrorMessage = '';
  compSuccessMessage = '';

  constructor(
    private route: ActivatedRoute,
    private induErrorService: InduErrorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (this.userId) {
      this.loadUsername();
      this.loadStream();
    } else {
      this.errorMessage = 'Aucun identifiant utilisateur fourni.';
    }
  }

  loadUsername(): void {
    this.userService.getUsername(this.userId).subscribe({
      next: (data) => this.username = data.username,
      error: () => this.username = 'Utilisateur inconnu'
    });
  }

  loadStream(): void {
    this.loading = true;
    this.clearMessages();
    this.induErrorService.getEventStream(
      this.userId,
      this.currentFilter,
      this.currentPage,
      this.pageSize,
      this.selectedEventType,
      this.fromDate ? this.fromDate + "T00:00:00Z" : '',
      this.toDate ? this.toDate + "T23:59:59Z" : ''
    ).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Cette Utilisateur n"est pas encore valider.';
        this.loading = false;
      }
    });
  }

  // Filters
  changeFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.loadStream();
  }

  getAmount(event: any): string {
    return event.payload.amount ?? event.payload.totalUntreatedAmount ?? '-';
  }

  // Process Errors
  processErrors(): void {
    this.clearMessages();
    this.induErrorService.processErrors(this.userId).subscribe({
      next: () => {
        this.successMessage = 'Traitement effectué avec succès.';
        this.loadStream();
      },
      error: () => this.errorMessage = 'Erreur lors du traitement des erreurs.'
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Pagination
  nextPage(): void {
    if (this.events.length === this.pageSize) {
      this.currentPage++;
      this.loadStream();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadStream();
    }
  }

  // Toggle forms with sliding
  toggleForm(form: 'indu' | 'comp') {
    if (form === 'indu') {
      this.showAddIndu = !this.showAddIndu;
      if (this.showAddIndu) this.showAddCompensation = false;
    } else {
      this.showAddCompensation = !this.showAddCompensation;
      if (this.showAddCompensation) this.showAddIndu = false;
    }
  }

  // Embedded forms
  addInduError(): void {
    this.induErrorMessage = '';
    this.induSuccessMessage = '';
    if (this.newInduAmount && this.newInduAmount > 0) {
      this.induErrorService.addInduError(this.userId, this.newInduAmount).subscribe({
        next: () => {
          this.induSuccessMessage = 'Erreur Indu ajoutée avec succès.';
          this.newInduAmount = null;
          this.loadStream();
        },
        error: () => this.induErrorMessage = 'Erreur lors de l\'ajout de l\'erreur Indu.'
      });
    } else this.induErrorMessage = 'Merci de saisir un montant valide.';
  }

  addCompensation(): void {
    this.compErrorMessage = '';
    this.compSuccessMessage = '';
    if (this.newCompensationAmount && this.newCompensationAmount > 0) {
      this.induErrorService.addCompensation(this.userId, this.newCompensationAmount).subscribe({
        next: () => {
          this.compSuccessMessage = 'Compensation ajoutée avec succès.';
          this.newCompensationAmount = null;
          this.loadStream();
        },
        error: () => this.compErrorMessage = 'Erreur lors de l\'ajout de la compensation.'
      });
    } else this.compErrorMessage = 'Merci de saisir un montant valide.';
  }
}