import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StudentsModule } from './pages/students/students.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from './components/components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from './translate/i18n/i18n.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsModule } from './pages/appointments/appointments.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { settingsReducer } from './reducers/settings.reducer';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { authInterceptorProviders } from './interceptors/auth-interceptor';
import { SettingsEffect } from './settings/settings.effects';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
/* import { progressStompConfig, ProgressWebsocketService } from './my-rx-stomp.config';
import { StompConfig } from '@stomp/stompjs'; */
import { StudentsWebsocketService } from './pages/students/service/students-websocket.service';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    StudentsModule,
    AppointmentsModule,
    ComponentsModule,
    FlexLayoutModule,
    StoreModule.forRoot({
      settingsState: settingsReducer
    }),
    EffectsModule.forRoot([SettingsEffect]),
    StoreDevtoolsModule.instrument({ maxAge: 25}),
    FlatpickrModule.forRoot(),
    I18nModule,
    //CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    //NgbModule,
  ],
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    I18nModule
  ],
  providers: [
    authInterceptorProviders,
    RxStompService,
    StudentsWebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
