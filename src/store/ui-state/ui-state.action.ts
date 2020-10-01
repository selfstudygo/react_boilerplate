import { ModalInterface } from '@models/ui/modal.model';

export const UiStateType = {
  WARN_MODAL: '[Ui State] Warn Modal',
  ERROR_MODAL: '[Ui State] Error Modal',
  NONE_MODAL: '[Ui State] None Modal',
  INFO_MODAL: '[Ui State] Info Modal',
};

export class WarnModalAction {
  type = UiStateType.WARN_MODAL;
  payload: ModalInterface;

  constructor(payload: ModalInterface) {
    this.payload = { type: 'warn', title: payload.title, info: payload.info };
  }
}

export class ErrorModalAction {
  type = UiStateType.ERROR_MODAL;
  payload: ModalInterface;

  constructor(payload: ModalInterface) {
    this.payload = { type: 'error', title: payload.title, info: payload.info };
  }
}

export class InfoModalAction {
  type = UiStateType.INFO_MODAL;
  payload: ModalInterface;

  constructor(payload: ModalInterface) {
    this.payload = { type: 'info', title: payload.title, info: payload.info };
  }
}

export class HideModalAction {
  type = UiStateType.NONE_MODAL;
  payload = null;
}

Object.freeze(UiStateType);
