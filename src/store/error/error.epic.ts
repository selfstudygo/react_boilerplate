import { Observable } from 'rxjs';
import { combineEpics, ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { ErrorActionTitles, ErrorActionType } from './error.action';
import { Action } from 'redux';
import { ErrorModalAction } from '@store/ui-state/ui-state.action';

const apiErrorEpic: (source: Observable<ActionWithPayload>) => Observable<Action> = (action$) =>
  action$.pipe(
    ofType(ErrorActionType.API),
    map((action) => new ErrorModalAction({ title: ErrorActionTitles.API, info: action.payload })),
  );

export const errorEpic = combineEpics(apiErrorEpic);
