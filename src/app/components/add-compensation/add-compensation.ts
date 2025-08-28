import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InduErrorService } from '../../services/indu-error.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-compensation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-compensation.html', // <-- external HTML
})
export class AddCompensationComponent {
  userId: string = '';
  newCompensationAmount: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private induErrorService: InduErrorService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }

  addCompensation(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.newCompensationAmount && this.newCompensationAmount > 0) {
      this.induErrorService.addCompensation(this.userId, this.newCompensationAmount).subscribe({
        next: () => {
          this.successMessage = 'Compensation ajoutée avec succès.';
          this.newCompensationAmount = null;
        },
        error: () => this.errorMessage = 'Erreur lors de l\'ajout de la compensation.'
      });
    } else {
      this.errorMessage = 'Merci de saisir un montant valide.';
    }
  }
}
