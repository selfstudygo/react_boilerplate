export const ErrorActionTitles = {
  API: 'Api Error',
};

export const ErrorActionType = {
  REPORT: '[Error] Report',
  API: '[Error] Api',
};

export class ReportErrorAction {
  type = ErrorActionType.REPORT;
}

export class ApiErrorAction {
  type = ErrorActionType.API;
  payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
}
Object.freeze(ErrorActionTitles);
Object.freeze(ErrorActionType);
