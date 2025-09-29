import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { UserInduState } from '../../Models/UserInduState';

@Component({
  selector: 'app-user-handled-stream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-handled-stream.html',
  styleUrls: ['./user-handled-stream.css']
})
export class UserHandledStreamComponent implements OnInit {

  userId = '';
  username = '';
  events: any[] = [];
  errorMessage = '';
  loading = false;

  currentPage = 0;
  pageSize = 10;
  netTotal: number | null = null;

  // Animation helpers
  recentEventIds = new Set<string>();
  totalsUpdated = false;

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
    this.loadHandledStream();
    this.loadNetTotal();
  }

  loadUsername(): void {
    this.userService.getUsername(this.userId).subscribe({
      next: data => this.username = data.username,
      error: () => this.username = 'Utilisateur inconnu'
    });
  }

  loadHandledStream(): void {
    this.loading = true;
    this.errorMessage = '';
    this.induErrorService.getEventStream(
      this.userId,
      'ONLY_HANDLED',
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: data => { 
        this.events = data; 

        // mark recent events for animation
        this.recentEventIds.clear();
        data.forEach(event => this.recentEventIds.add(event.id || event.eventType + event.createdAt));

        this.loading = false; 
      },
      error: () => { 
        this.errorMessage = 'User still need validation.'; 
        this.loading = false; 
      }
    });
  }

  loadNetTotal(): void {
    this.induErrorService.getUserState(this.userId).subscribe({
      next: (state: UserInduState) => {
        // Trigger flash animation if value changed
        if (this.netTotal !== null && this.netTotal !== state.netTotal) {
          this.totalsUpdated = true;
          setTimeout(() => this.totalsUpdated = false, 1000); // animation duration
        }
        this.netTotal = state.netTotal ?? 0;
      },
      error: () => this.netTotal = null
    });
  }

  refreshData(): void {
    this.loadHandledStream();
    this.loadNetTotal();
  }

  processErrors(): void {
    this.errorMessage = '';
    this.induErrorService.processErrors(this.userId).subscribe({
      next: () => this.refreshData(),
      error: () => this.errorMessage = 'Erreur lors du traitement des erreurs.'
    });
  }

  getAmount(event: any): string {
    if (event.payload?.netTotal !== undefined) return event.payload.netTotal.toFixed(2);
    return event.payload.amount?.toFixed(2) ?? '-';
  }

  isRecentEvent(event: any): boolean {
    return this.recentEventIds.has(event.id || event.eventType + event.createdAt);
  }

  nextPage(): void { 
    if (this.events.length === this.pageSize) { 
      this.currentPage++; 
      this.loadHandledStream(); 
    } 
  }

  prevPage(): void { 
    if (this.currentPage > 0) { 
      this.currentPage--; 
      this.loadHandledStream(); 
    } 
  }
}
