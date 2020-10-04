import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { actionSettingsCurrentLanguage } from "./settings.actions";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { SettingsState } from "./settings.models";
import { selectSettingsCurrentLanguage } from './settings.selectors';


export const SETTINGS_KEY = 'settingsState';

@Injectable()
export class SettingsEffect{
    constructor(private actions$: Actions,
                private store: Store<{settings: SettingsState}>){

    }

    persistSettingsCurrentLanguage$ = createEffect(() => 
        this.actions$.pipe(
                ofType(actionSettingsCurrentLanguage),
                withLatestFrom(this.store.pipe(select(selectSettingsCurrentLanguage))),
                tap(([action, settings]) =>{
                    window.sessionStorage.setItem('currentLanguage', JSON.stringify(settings))
                     //localStorage.setItem('authenticated', JSON.stringify(settings))
                }
                )
    ),{ dispatch: false }
    )
}