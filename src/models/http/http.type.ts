export type HTTP_METHOD = 'POST' | 'GET' | 'OPTIONS' | 'HEAD' | 'PATCH' | 'DELETE';

export interface HttpResponseInterface {
  url: string;
  method: HTTP_METHOD;
  status: number;
  body: any;
  headers: Headers;
  ok?: boolean;
}

export class HttpResponse implements HttpResponseInterface {
  url: string;
  method: HTTP_METHOD;
  status: number;
  body: any;
  ok?: boolean;
  headers: Headers;
  constructor(obj: HttpResponseInterface) {
    this.url = obj.url;
    this.method = obj.method;
    this.status = obj.status;
    this.body = obj.body;
    this.ok = obj.ok;
    this.headers = obj.headers;
  }
}
