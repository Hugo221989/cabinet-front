import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

registerLocaleData(localeEs);
registerLocaleData(localeEn);

const userDefaults: FlatpickrDefaultsInterface = {locale: Spanish};userDefaults.utc = true;

@NgModule({
  declarations: [AppointmentsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot({locale: Spanish}),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AppointmentsRoutingModule,
    TranslateModule
  ],
  exports: [
    AppointmentsListComponent
  ]
})
export class AppointmentsModule { }
