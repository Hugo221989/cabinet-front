import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './list/students.component';
import { StudentDetailComponent } from './detail/student-detail.component';
import { AuthGuardGuard } from 'src/app/auth/auth-guard.guard';

const routes: Routes = [
  { path: 'students/list', component: StudentsComponent,canActivate: [AuthGuardGuard] },
  { path: 'student/detail/:id', component: StudentDetailComponent,canActivate: [AuthGuardGuard] },
  { path: 'student/detail', component: StudentDetailComponent,canActivate: [AuthGuardGuard] },
  { path: '', redirectTo: 'students/list', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuardGuard
  ]
})
export class StudentsRoutingModule { }
