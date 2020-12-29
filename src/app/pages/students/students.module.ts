import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StudentsComponent } from './list/students.component';
import { StudentsRoutingModule } from './students-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { StudentDetailComponent } from './detail/student-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { StudentMeetingTableComponent } from './student-meeting-table/student-meeting-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentsWebsocketService } from './service/students-websocket.service';
/* import { StompConfig } from '@stomp/stompjs';
import { progressStompConfig, ProgressWebsocketService } from 'src/app/my-rx-stomp.config'; */
import { RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { FormDialogModule } from '../form-dialog/form-dialog.module';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentDetailComponent,
    StudentMeetingTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentsRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    TranslateModule,
    PipesModule,
    MatDialogModule,
    FormDialogModule
  ],
  providers: [
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    RxStompService,
    StudentsWebsocketService,
    DatePipe
  ]
})
export class StudentsModule { }
