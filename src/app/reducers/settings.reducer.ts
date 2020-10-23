import * as SettingsActions from '../settings/settings.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { SettingsState } from '../settings/settings.models';


export const initialState: SettingsState = {
    currentLanguage: 'es',
    isAuthenticated: false
}

const reducer = createReducer( 
    initialState, 
    on(SettingsActions.actionSettingsCurrentLanguage,
        (state, action) => ({...state, ...action}) ),
    on(SettingsActions.actionSettingsIsAuthenticated,
        (state, {isAuthenticated}) => ({...state, isAuthenticated}))
)

export function settingsReducer(
    state: SettingsState | undefined,
    action: Action
){
    return reducer(state, action);
}