// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './components/user-list/user-list';
import { UserStreamComponent } from './components/user-stream/user-stream';
import { AdminUserValidation } from './components/admin-user-validation/admin-user-validation';
import { AddInduErrorComponent } from './components/add-indu-error/add-indu-error';
import { AddCompensationComponent } from './components/add-compensation/add-compensation';
import { UserHandledStreamComponent } from './components/user-handled-stream/user-handled-stream';

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'users/:userId/stream', component: UserStreamComponent },
  { path: 'user/:userId/add-indu-error', component: AddInduErrorComponent },
  { path: 'user/:userId/add-compensation', component: AddCompensationComponent },
  { path: 'user/:userId/handled-stream', component: UserHandledStreamComponent }, // new handled stream route
  { path: 'admin/validate-users', component: AdminUserValidation },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
