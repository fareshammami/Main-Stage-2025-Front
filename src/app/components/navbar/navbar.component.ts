import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [NgIf, RouterLink]
})
export class NavbarComponent implements OnInit {
  username: string = '';
  userId: string = ''; // <-- add this
  roles: string[] = []; // store user roles

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      const profile = await this.keycloakService.loadUserProfile();
      this.username = profile.email || '';

      // get roles and userId from Keycloak token
      const keycloak = this.keycloakService.getKeycloakInstance();
      this.roles = keycloak.realmAccess?.roles || [];
      this.userId = keycloak.subject || ''; // <-- assign Keycloak userId
    }
  }

  isAdmin(): boolean {
    return this.roles.includes('admin');
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  manageAccount(): void {
    const keycloak = this.keycloakService.getKeycloakInstance();
    if (keycloak?.accountManagement) {
      keycloak.accountManagement();
    } else {
      window.location.href = `${keycloak.authServerUrl}/realms/${keycloak.realm}/account`;
    }
  }
}