import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { actionSettingsCurrentLanguage, actionSettingsIsAuthenticated } from "./settings.actions";
import { map, withLatestFrom, tap } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { SettingsState } from "./settings.models";
import { selectSettingsCurrentLanguage, selectSettingsisAuthenticated } from './settings.selectors';
import { Router } from '@angular/router';


export const SETTINGS_KEY = 'settingsState';

const LOGIN_PATH = '/login';

@Injectable()
export class SettingsEffect{
    constructor(private actions$: Actions,
                private store: Store<{settings: SettingsState}>, 
                private router: Router){

    }

    persistSettingsCurrentLanguage$ = createEffect(() => 
        this.actions$.pipe(
                ofType(actionSettingsCurrentLanguage),
                withLatestFrom(this.store.pipe(select(selectSettingsCurrentLanguage))),
                tap(([action, settings]) =>{
                    window.sessionStorage.setItem('currentLanguage', JSON.stringify(settings))
                }
                )
    ),{ dispatch: false }
    );

    persistSettingsIsAuthenticathed$ = createEffect(() => 
        this.actions$.pipe(
                ofType(actionSettingsIsAuthenticated),
                withLatestFrom(this.store.pipe(select(selectSettingsisAuthenticated))),
                tap(([action, settings]) =>{ console.log("EFFECT AUTH: ",action.isAuthenticated);
                    if(!action.isAuthenticated){
                        window.sessionStorage.clear();
                        this.router.navigate([LOGIN_PATH])
                    }
                }
                )
    ),{ dispatch: false }
    );
}