import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInduState } from '../../Models/UserInduState';

@Component({
  selector: 'app-user-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-stream.html',
  styleUrls: ['./user-stream.css']
})
export class UserStreamComponent implements OnInit {

  userId = '';
  username = '';
  events: any[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;

  // User state
  netTotal: number | null = null;
  totalsUpdated = false;

  // Filters
  currentFilter = 'ALL';  
  selectedEventType = '';
  fromDate = '';
  toDate = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;

  // Forms
  showAddIndu = false;
  showAddCompensation = false;
  newInduAmount: number | null = null;
  newCompensationAmount: number | null = null;
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
    if (!this.userId) {
      this.errorMessage = 'Aucun identifiant utilisateur fourni.';
      return;
    }
    this.loadUsername();
    this.refreshData();
  }

  loadUsername(): void {
    this.userService.getUsername(this.userId).subscribe({
      next: data => this.username = data.username,
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
      next: data => { this.events = data; this.loading = false; },
      error: () => { this.errorMessage = 'This user has an empty steam'; this.loading = false; }
    });
  }

  loadNetTotal(): void {
    this.induErrorService.getUserState(this.userId).subscribe({
      next: (state: UserInduState) => {
        if (this.netTotal !== state.netTotal) {
          this.totalsUpdated = true;
          setTimeout(() => this.totalsUpdated = false, 800); // flash effect
        }
        this.netTotal = state.netTotal ?? 0;
      },
      error: (err) => {
        console.error('Error loading netTotal:', err);
        this.netTotal = null;
      }
    });
  }

  refreshData(): void {
    this.loadStream();
    this.loadNetTotal();
  }

  changeFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.refreshData();
  }

  getAmount(event: any): string {
    if (event.payload?.amount !== undefined) return event.payload.amount.toFixed(2);
    if (event.payload?.totalHandledInduErrors !== undefined && event.payload?.totalHandledCompensations !== undefined) {
      return (event.payload.totalHandledInduErrors - event.payload.totalHandledCompensations).toFixed(2);
    }
    return '-';
  }

  getStatus(event: any): string {
    if (!event.payload?.status) return '-';
    return event.payload.status === 'TRAITED' ? 'TRAITÉ' : 'NON TRAITÉ';
  }

  processErrors(): void {
    this.clearMessages();
    this.induErrorService.processErrors(this.userId).subscribe({
      next: () => this.refreshData(),
      error: () => this.errorMessage = 'Erreur lors du traitement des erreurs.'
    });
  }

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

  toggleForm(form: 'indu' | 'comp') {
    if (form === 'indu') { 
      this.showAddIndu = !this.showAddIndu; 
      if (this.showAddIndu) this.showAddCompensation = false; 
    } else { 
      this.showAddCompensation = !this.showAddCompensation; 
      if (this.showAddCompensation) this.showAddIndu = false; 
    }
  }

  addInduError(): void {
    if (!this.newInduAmount || this.newInduAmount <= 0) { 
      this.induErrorMessage = 'Merci de saisir un montant valide.'; 
      return; 
    }
    this.clearMessages();
    this.induErrorService.addInduError(this.userId, this.newInduAmount).subscribe({
      next: () => { 
        this.induSuccessMessage = 'Erreur Indu ajoutée avec succès.'; 
        this.newInduAmount = null; 
        this.refreshData(); 
      },
      error: () => this.induErrorMessage = 'Erreur lors de l\'ajout de l\'erreur Indu.'
    });
  }

  addCompensation(): void {
    if (!this.newCompensationAmount || this.newCompensationAmount <= 0) { 
      this.compErrorMessage = 'Merci de saisir un montant valide.'; 
      return; 
    }
    this.clearMessages();
    this.induErrorService.addCompensation(this.userId, this.newCompensationAmount).subscribe({
      next: () => { 
        this.compSuccessMessage = 'Compensation ajoutée avec succès.'; 
        this.newCompensationAmount = null; 
        this.refreshData(); 
      },
      error: () => this.compErrorMessage = 'Erreur lors de l\'ajout de la compensation.'
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.induErrorMessage = '';
    this.induSuccessMessage = '';
    this.compErrorMessage = '';
    this.compSuccessMessage = '';
  }
}