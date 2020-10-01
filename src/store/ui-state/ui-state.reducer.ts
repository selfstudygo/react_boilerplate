import { UiStateType } from './ui-state.action';

const initialState = {
  modal: null,
};
export const uiStateReducer = (state = initialState, action: ActionWithPayload) => {
  switch (action.type) {
    case UiStateType.WARN_MODAL:
    case UiStateType.ERROR_MODAL:
    case UiStateType.INFO_MODAL:
      return { ...state, modal: action.payload! };
    default:
      return state;
  }
};
