import axios, { AxiosResponse } from 'axios';
import { ConnectableObservable, Observable } from 'rxjs';
import { HTTP_METHOD, HttpResponse } from '@models/http/http.type';
import { publish } from 'rxjs/operators';

const defaultOption = {
  // `url` is the server URL that will be used for the request
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  timeout: 1000, // default is `0` (no timeout)
  withCredentials: false, // default
  maxContentLength: 2000,
  maxRedirects: 5, // default
};

class AxiosClient {
  get(url: string, options = {}) {
    return this.request('GET', url, options);
  }

  post(url: string, data: {}, options = {}) {
    return this.request('POST', url, { data, ...options });
  }

  patch(url: string, data: {}, options = {}) {
    return this.request('PATCH', url, { data, ...options });
  }

  request(method: HTTP_METHOD, url: string, options: any): Observable<HttpResponse> {
    const http$ = new Observable((subscriber) => {
      axios({ method, url, ...defaultOption, ...options })
        .then((res: AxiosResponse) => {
          const data = { url, method, status: res.status, response: res.data, ok: true };
          subscriber.next(new HttpResponse(data));
          subscriber.complete();
        })
        .catch((err) => {
          const res = err.response || { status: 0, data: { error: 'Network Error Occurred' } };
          const data = { url, method, status: res.status, response: res.data, ok: false };
          subscriber.error(new HttpResponse(data));
          subscriber.complete();
        });
    }).pipe(publish());
    (http$ as ConnectableObservable<HttpResponse>).connect();
    return http$;
  }
}

export const axiosClient = new AxiosClient();
