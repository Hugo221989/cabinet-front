import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './list/students.component';
import { StudentDetailComponent } from './detail/student-detail.component';

const routes: Routes = [
  { path: 'students/list', component: StudentsComponent },
  { path: 'student/detail/:id', component: StudentDetailComponent },
  { path: 'student/detail', component: StudentDetailComponent },
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
  ]
})
export class StudentsRoutingModule { }
