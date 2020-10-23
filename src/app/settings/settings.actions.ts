import { createAction, props } from '@ngrx/store';

export const actionSettingsCurrentLanguage = createAction(
    '[Settings] Current Language',
    props<{currentLanguage: string}>()
);

export const actionSettingsIsAuthenticated = createAction(
    '[Settings] User Authenticated',
    props<{isAuthenticated: boolean}>()
);
