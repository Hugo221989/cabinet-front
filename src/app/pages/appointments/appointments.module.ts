import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentsListComponent } from './list/appointments-list.component';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TranslateModule } from '@ngx-translate/core';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { Spanish } from "flatpickr/dist/l10n/es.js"
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr/flatpickr-defaults.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormDialogModule } from '../form-dialog/form-dialog.module';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

const userDefaults: FlatpickrDefaultsInterface = {locale: Spanish};userDefaults.utc = true;

@NgModule({
  declarations: [AppointmentsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot({locale: Spanish}),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AppointmentsRoutingModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    FormDialogModule
    ],
  exports: [
    AppointmentsListComponent
  ]
})
export class AppointmentsModule { }
