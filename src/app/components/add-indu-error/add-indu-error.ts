import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-indu-error',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-indu-error.html', // <-- external HTML
})
export class AddInduErrorComponent {
  userId: string = '';
  newInduAmount: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private induErrorService: InduErrorService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }

  addInduError(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.newInduAmount && this.newInduAmount > 0) {
      this.induErrorService.addInduError(this.userId, this.newInduAmount).subscribe({
        next: () => {
          this.successMessage = 'Erreur Indu ajoutée avec succès.';
          this.newInduAmount = null;
        },
        error: () => this.errorMessage = 'Erreur lors de l\'ajout de l\'erreur Indu.'
      });
    } else {
      this.errorMessage = 'Merci de saisir un montant valide.';
    }
  }
}
