import { ConnectableObservable, Observable } from 'rxjs';
import { HTTP_METHOD, HttpResponse } from '@models/http/http.type';
import 'whatwg-fetch';
import { publish } from 'rxjs/operators';

const defaultOption = {
  // `url` is the server URL that will be used for the request
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  referrer: 'no-referrer',
  withCredentials: false, // default
  maxContentLength: 2000,
  maxRedirects: 5, // default
};

export class FetchClient {
  get(url: string, options = {}) {
    return this.request('GET', url, options);
  }

  post(url: string, body: {}, options = {}) {
    return this.request('POST', url, { body: JSON.stringify(body), ...options });
  }

  request(method: HTTP_METHOD, url: string, options: any): Observable<any> {
    const config = { method, ...defaultOption, ...options };
    const http$ = new Observable((subscriber) => {
      fetch(url, config)
        .catch(() => {
          const data = {
            url,
            method,
            status: 0,
            response: { error: 'Network Error Occurred' },
            ok: false,
          };
          subscriber.error(new HttpResponse(data));
          subscriber.complete();
          return null;
        })
        .then((res: Response | null) => {
          if (res) {
            const data = { url, method, status: res.status, response: {}, ok: res.ok };
            return res
              .text()
              .then((text) => {
                try {
                  data.response = JSON.parse(text);
                } catch (e) {
                  data.response = { text };
                }

                if (data.ok) {
                  subscriber.next(new HttpResponse(data));
                  subscriber.complete();
                } else {
                  subscriber.error(new HttpResponse(data));
                  subscriber.complete();
                }
              })
              .catch(() => {
                data.response = { error: 'Parsing Error Occurred.' };
                subscriber.error(new HttpResponse(data));
                subscriber.complete();
              });
          }
        });
    }).pipe(publish());
    (http$ as ConnectableObservable<HttpResponse>).connect();
    return http$;
  }
}

export const fetchClient = new FetchClient();
