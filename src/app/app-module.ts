// app.module.ts
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './keycloak-init';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

// Components
import { UserListComponent } from './components/user-list/user-list';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminUserValidation } from './components/admin-user-validation/admin-user-validation';
import { UserStreamComponent } from './components/user-stream/user-stream';

@NgModule({
  declarations: [
    App,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NavbarComponent,
    UserListComponent,
    UserStreamComponent,
    AdminUserValidation,
    
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
