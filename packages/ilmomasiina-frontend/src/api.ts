interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  accessToken?: string;
}

export default async function apiFetch(uri: string, {
  method = 'GET', body, headers, accessToken,
}: FetchOptions = {}) {
  const allHeaders = {
    ...headers || {},
  };
  if (accessToken) {
    allHeaders.Authorization = accessToken;
  }
  if (body !== undefined) {
    allHeaders['Content-Type'] = 'application/json; charset=utf-8';
  }

  const response = await fetch(`${PREFIX_URL}/api/${uri}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: allHeaders,
  });

  if (response.status > 299) {
    try {
      const data = await response.json();
      throw new Error(data.message || response.statusText);
    } catch (e) {
      throw new Error(response.statusText);
    }
  }
  return response.status === 204 ? null : response.json();
}
