import { combineReducers } from 'redux';
import { uiStateReducer } from './ui-state/ui-state.reducer';

export const rootReducer = combineReducers({
  uiStateReducer,
});
