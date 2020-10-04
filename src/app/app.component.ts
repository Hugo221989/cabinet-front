import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { actionSettingsCurrentLanguage } from './settings/settings.actions';
import { SettingsState } from './settings/settings.models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'cabinet-front';

  constructor(public translate: TranslateService,
    private store: Store<{settings: SettingsState}>) { }

    ngOnInit(){console.log("LANG: ",this.translate.currentLang);
      this.store.dispatch(actionSettingsCurrentLanguage({
        currentLanguage: this.translate.currentLang
      }))
    }

  currentLanguage(selectedLanguage){
    this.translate.use(selectedLanguage);
    this.dispatchChangeLanguage(selectedLanguage);
  }

  dispatchChangeLanguage(selectedLanguage: string){
    this.store.dispatch(actionSettingsCurrentLanguage({
      currentLanguage: selectedLanguage
    }))
  }
}
