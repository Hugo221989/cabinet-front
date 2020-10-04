import { createAction, props } from '@ngrx/store';

export const actionSettingsCurrentLanguage = createAction(
    '[Settings] Current Language',
    props<{currentLanguage: string}>()
);
