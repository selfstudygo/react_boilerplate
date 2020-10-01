export type HTTP_METHOD = 'POST' | 'GET' | 'OPTIONS' | 'HEAD' | 'PATCH' | 'DELETE';

interface HttpResponseInterface {
  url: string;
  method: HTTP_METHOD;
  status: number;
  response: any;
  ok?: boolean;
}

export class HttpResponse implements HttpResponseInterface {
  url: string;
  method: HTTP_METHOD;
  status: number;
  response: any;
  ok?: boolean;
  constructor(obj: HttpResponseInterface) {
    this.url = obj.url;
    this.method = obj.method;
    this.status = obj.status;
    this.response = obj.response;
    this.ok = obj.ok;
  }
}
