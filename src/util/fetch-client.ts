import { Observable, Subject } from 'rxjs';
import { HTTP_METHOD, HttpResponse, HttpResponseInterface } from '@models/http/http.type';
import 'whatwg-fetch';

export class FetchClient {
  defaultHeaders: { [key: string]: string } = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  defaultOption: { [key: string]: any } = {
    // `url` is the server URL that will be used for the request
    withCredentials: false, // default
    maxContentLength: 2000,
    maxRedirects: 5, // default
    timeout: 3000,
    retry: 0,
  };
  baseUrl: string;
  isAbsolutePath: boolean;
  constructor(baseUrl?: string) {
    this.isAbsolutePath = /^https?:\/\//.test(baseUrl || '');
    this.baseUrl = this.isAbsolutePath ? <string>baseUrl : '';
  }

  normalizeUrl(url: string) {
    if (!this.isAbsolutePath || /^https?:\/\//.test(url)) {
      return url;
    }
    return new URL(url, this.baseUrl).toString();
  }

  get(url: string, options = {}) {
    return this.request('GET', this.normalizeUrl(url), options);
  }

  delete(url: string, options = {}) {
    return this.request('DELETE', this.normalizeUrl(url), options);
  }

  post(url: string, body: {}, options = {}) {
    return this.request('POST', this.normalizeUrl(url), { body, ...options });
  }

  patch(url: string, body: {}, options = {}) {
    return this.request('PATCH', this.normalizeUrl(url), { body, ...options });
  }

  private retry(api: Observable<HttpResponse>, times: number) {
    const api$ = new Subject<HttpResponse>();
    const innerRetry = (t: number) => {
      api.subscribe(
        (response: HttpResponse) => {
          api$.next(response);
          api$.complete();
        },
        (response: HttpResponse) => {
          if (t === 0) {
            api$.error(response);
            api$.complete();
          } else {
            innerRetry(t - 1);
          }
        },
      );
    };
    innerRetry(times);
    return api$;
  }

  getContentType(headers: Headers) {
    const contentType = headers.get('Content-Type');
    if (!contentType) return '';
    if (/json/.test(contentType)) {
      return 'json';
    }
    if (/text/.test(contentType)) {
      return 'text';
    }
    return contentType;
  }

  private decodeBody(res: Response) {
    const contentType = this.getContentType(res.headers);
    switch (contentType) {
      case 'json':
        return res.json();
      case 'text':
        return res.text();
      default:
        return res.blob();
    }
  }

  createHeaders(option: { [k: string]: string }) {
    const data = option ? { ...this.defaultHeaders, ...option } : this.defaultHeaders;
    const headers = new Headers();
    Object.keys(data).forEach((key) => {
      headers.set(key, data[key]);
    });
    // sending multipart form requires boundary specified...
    // we can remove the content type so server can guess
    if (/multipart\/form-data/.test(headers.get('Content-Type') || '')) {
      headers.delete('Content-Type');
    }
    return headers;
  }

  request(method: HTTP_METHOD, url: string, options: any): Observable<HttpResponse> {
    const headers = this.createHeaders(options.headers);
    const config = { method, ...this.defaultOption, ...options, headers };
    const http$ = new Observable<HttpResponse>((subscriber) => {
      const done = (data: HttpResponseInterface) => {
        if (data.ok) {
          subscriber.next(new HttpResponse(data));
        } else {
          subscriber.error(new HttpResponse(data));
        }
        subscriber.complete();
      };
      fetch(url, config)
        .then((res: Response) => {
          // 400 | 500 errors come here
          const data = {
            url,
            method,
            status: res.status,
            body: {},
            ok: res.ok,
            headers: res.headers,
          };
          const responseObj = this.decodeBody(res);

          // if asRaw is set on... then send res itself as data so user can unwrap it.
          if (options.asRaw) {
            data.body = res;
            done(data);
            return;
          }
          // otherwise unwrap it here
          return responseObj
            .then((body: {} | string) => {
              data.body = body;
              done(data);
            })
            .catch(() => {
              data.body = { error: 'Parsing Error Occurred.' };
              data.ok = false;
              done(data);
            });
        })
        .catch((e) => {
          // when proper answer has not received case.. like cors or offline
          const data = {
            url,
            method,
            status: 0,
            body: { error: `Network Error Occurred: ${e.message}` },
            ok: false,
            headers: e.headers,
          };
          done(data);
        });
    });
    return this.retry(http$, options.retry || 0);
  }
}

export const fetchClient = new FetchClient();
