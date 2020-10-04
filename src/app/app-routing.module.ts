import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'students', 
  loadChildren: async () => (await import('./pages/students/students.module')).StudentsModule,},
  { path: 'appointments', 
  loadChildren: async () => (await import('./pages/appointments/appointments.module')).AppointmentsModule,},
  { path: 'account', 
  loadChildren: async () => (await import('./pages/account/account.module')).AccountModule,},
  { path: '', redirectTo: '/students', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
