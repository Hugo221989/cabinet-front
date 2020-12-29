import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingFormDialog } from './meeting-form-dialog/meeting-form-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { Spanish } from "flatpickr/dist/l10n/es.js"
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr/flatpickr-defaults.service';
import { DeleteMeetingDialogComponent } from './delete-meeting-dialog/delete-meeting-dialog.component';

const userDefaults: FlatpickrDefaultsInterface = {locale: Spanish};userDefaults.utc = true;

@NgModule({
  declarations: [MeetingFormDialog, DeleteMeetingDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FlatpickrModule.forRoot({locale: Spanish})
  ],
  exports: [
    MeetingFormDialog,
    DeleteMeetingDialogComponent
  ]
})
export class FormDialogModule { }
