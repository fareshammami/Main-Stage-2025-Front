import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { UserService } from '../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-handled-stream',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './user-handled-stream.html',
  styleUrls: ['./user-handled-stream.css']
})
export class UserHandledStreamComponent implements OnInit {

  userId: string = '';
  username: string = '';
  events: any[] = [];
  errorMessage = '';
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;

  // Special field for last InduErrorCurrentStateEvent
  lastInduAmount: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private induErrorService: InduErrorService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (this.userId) {
      this.loadUsername();
      this.loadHandledStream();
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

  loadHandledStream(): void {
    this.loading = true;
    this.errorMessage = '';

    this.induErrorService.getEventStream(
      this.userId,
      'ONLY_HANDLED', // always fetch handled events
      this.currentPage,
      this.pageSize,
      '', // no eventType filter
      '', // no fromDate
      ''  // no toDate
    ).subscribe({
      next: (data) => {
        console.log('Fetched events:', data);
        this.events = data;
        this.extractLastInduAmount();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des événements.';
        this.loading = false;
      }
    });
  }

  extractLastInduAmount(): void {
  const lastIndu = this.events
    .filter(e => e.eventType === 'InduErrorCurrentStateEvent')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  this.lastInduAmount = lastIndu ? (lastIndu.payload.totalUntreatedAmount ?? null) : null;
  console.log('Last Indu Amount:', this.lastInduAmount);
}

  getAmount(event: any): string {
    return event.payload.amount ?? event.payload.totalUntreatedAmount ?? '-';
  }

  // Pagination
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
