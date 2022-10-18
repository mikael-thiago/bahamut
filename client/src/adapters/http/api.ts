import { AxiosInstance, AxiosResponse } from "axios";

import { api } from "../../axios";

export interface HttpGetOptions {
  query?: Record<string, any>;
}
export abstract class HttpAdapter {
  abstract get<Response = any>(url: string, options?: HttpGetOptions): Promise<Response>;
  abstract post<Response = any, Body = any>(url: string, body?: Body): Promise<Response>;
  abstract put<Response = any>(url: string, body?: Body): Promise<Response>;
  abstract delete<Response = any>(url: string): Promise<Response>;
}

export class AxiosHttpAdapter implements HttpAdapter {
  constructor(private _axiosInstance: AxiosInstance) {}

  private _unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    return promise
      .then(res => res.data)
      .catch(err => {
        throw err.response.data;
      });
  }

  get<Response = any>(url: string, { query }: HttpGetOptions = {}): Promise<Response> {
    return this._unwrap(
      this._axiosInstance.get(url, {
        params: query,
      })
    );
  }

  post<Response = any, Body = any>(url: string, body?: Body | undefined): Promise<Response> {
    return this._unwrap(this._axiosInstance.post(url, body));
  }

  put<Response = any>(url: string, body?: Body | undefined): Promise<Response> {
    return this._unwrap(this._axiosInstance.put(url, body));
  }

  delete<Response = any>(url: string): Promise<Response> {
    return this._unwrap(this._axiosInstance.delete(url));
  }
}

export const httpAdapter: HttpAdapter = new AxiosHttpAdapter(api);
