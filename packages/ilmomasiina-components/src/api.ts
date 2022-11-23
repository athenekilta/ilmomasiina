export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  accessToken?: string;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  className?: string;
  data?: any;

  constructor(data: any) {
    super(data.message);
    this.name = 'ApiError';
    this.className = data.className;
    this.data = data.data;
  }

  static async fromResponse(response: Response) {
    let error = new Error(response.statusText);
    try {
      const data = await response.json();
      if (data.message) {
        error = new ApiError(data);
      }
    } catch (e) {
      /* fall through */
    }
    return error;
  }
}

let apiUrl = '/api';

export function configureApi(url: string) {
  apiUrl = url;
}

export default async function apiFetch(uri: string, {
  method = 'GET', body, headers, accessToken, signal,
}: FetchOptions = {}, onUnauthenticated?: () => void) {
  const allHeaders = {
    ...headers || {},
  };
  if (accessToken) {
    allHeaders.Authorization = accessToken;
  }
  if (body !== undefined) {
    allHeaders['Content-Type'] = 'application/json; charset=utf-8';
  }

  const response = await fetch(`${apiUrl}/${uri}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: allHeaders,
    signal,
  });

  if (response.status === 401 && onUnauthenticated) onUnauthenticated();

  if (response.status > 299) {
    throw await ApiError.fromResponse(response);
  }
  return response.status === 204 ? null : response.json();
}
