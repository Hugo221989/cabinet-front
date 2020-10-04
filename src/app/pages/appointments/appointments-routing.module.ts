import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsListComponent } from './list/appointments-list.component';

const routes: Routes = [
  { path: 'appointments/list', component: AppointmentsListComponent },
  { path: '', redirectTo: 'appointments/list', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppointmentsRoutingModule { }
