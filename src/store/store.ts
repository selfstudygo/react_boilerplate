import { ActionsObservable, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, createStore, compose, Action } from 'redux';
import { rootReducer } from '@store/store.reducer';
import { rootEpic } from '@store/store.epic';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

export const configureStore = () => {
  const createdStore = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));

  if ((module as any).hot) {
    const epic$ = new BehaviorSubject(rootEpic);
    const hotReloadingEpic = (actions$: ActionsObservable<Action>, store: any, dependencies: any) =>
      epic$.pipe(switchMap((epic) => epic(actions$, store, dependencies)));

    epicMiddleware.run(hotReloadingEpic);

    (module as any).hot.accept('@store/store.epic', () => {
      const nextRootEpic = require('@store/store.epic').rootEpic;
      epic$.next(nextRootEpic);
    });
  } else {
    epicMiddleware.run(rootEpic);
  }

  return createdStore;
};
