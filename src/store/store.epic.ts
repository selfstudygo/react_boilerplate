import { combineEpics, Epic } from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { Action } from 'redux';
import { errorEpic } from '@store/error/error.epic';

export const rootEpic: Epic<Action, Action> = (action$, store$, dependencies) =>
  combineEpics(errorEpic)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
