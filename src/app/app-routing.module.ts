import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './auth/auth-guard.guard';


const routes: Routes = [
  { path: 'students', 
  loadChildren: async () => (await import('./pages/students/students.module')).StudentsModule,canActivate: [AuthGuardGuard]},
  { path: 'appointments', 
  loadChildren: async () => (await import('./pages/appointments/appointments.module')).AppointmentsModule,canActivate: [AuthGuardGuard]},
  { path: 'login', 
  loadChildren: async () => (await import('./pages/login/login.module')).LoginModule,},
  { path: 'account', 
  loadChildren: async () => (await import('./pages/account/account.module')).AccountModule,canActivate: [AuthGuardGuard]},
  { path: '', redirectTo: 'appointments', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
  providers: [ AuthGuardGuard ]
})
export class AppRoutingModule { }
