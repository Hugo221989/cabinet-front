import { createSelector, createFeatureSelector } from "@ngrx/store";
import { SettingsState } from "./settings.models";

export const selectSettings = createFeatureSelector<SettingsState>('settingsState');
//const selectSettings = (state: any) => state.hasOwnProperty('currentLanguage') ? state.currentLanguage : 'es';

export const selectSettingsCurrentLanguage= createSelector(
    selectSettings,
    (state: SettingsState) => state.currentLanguage
)