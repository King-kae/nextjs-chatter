/**
 * Lightweight fetch-based HTTP client used across the app instead of apiClient.
 * Mirrors the small slice of the axios API the codebase relied on
 * (`.data`, thrown errors on non-2xx, `error.response.data`) so call sites
 * didn't need to be rewritten, while dropping the extra dependency in favor
 * of the platform-native fetch SDK.
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  response?: { data: any; status: number };
  constructor(message: string, response?: { data: any; status: number }) {
    super(message);
    this.name = "ApiError";
    this.response = response;
  }
}

type Body = Record<string, any> | FormData | File | Blob | ArrayBuffer | undefined;

interface RequestConfig {
  headers?: Record<string, string>;
  data?: any;
}

function isBinaryBody(body: Body) {
  return (
    typeof FormData !== "undefined" && body instanceof FormData ||
    typeof File !== "undefined" && body instanceof File ||
    typeof Blob !== "undefined" && body instanceof Blob ||
    body instanceof ArrayBuffer
  );
}

async function request<T = any>(
  method: string,
  url: string,
  body?: Body,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  const binary = isBinaryBody(body);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  // For FormData bodies, the browser must generate the Content-Type itself
  // (it includes a random multipart boundary the server needs to parse the
  // body). If a caller passes an explicit "Content-Type: multipart/form-data"
  // header — a holdover from axios, which silently drops that header for
  // FormData — fetch will honor it as-is, sending a boundary-less body the
  // server can't parse. So for FormData we always strip any Content-Type
  // the caller supplied and let fetch set it.
  let headers = config?.headers;
  if (isFormData && headers) {
    headers = Object.fromEntries(
      Object.entries(headers).filter(([key]) => key.toLowerCase() !== "content-type")
    );
  }

  const res = await fetch(url, {
    method,
    headers: binary
      ? headers
      : { "Content-Type": "application/json", ...(headers || {}) },
    body: binary
      ? (body as BodyInit)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : ((await res.text()) as unknown as T);

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && ((data as any).error || (data as any).message)) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, { data, status: res.status });
  }

  return { data: data as T, status: res.status };
}

export const apiClient = {
  get: <T = any>(url: string, config?: RequestConfig) =>
    request<T>("GET", url, undefined, config),
  post: <T = any>(url: string, body?: Body, config?: RequestConfig) =>
    request<T>("POST", url, body, config),
  put: <T = any>(url: string, body?: Body, config?: RequestConfig) =>
    request<T>("PUT", url, body, config),
  patch: <T = any>(url: string, body?: Body, config?: RequestConfig) =>
    request<T>("PATCH", url, body, config),
  delete: <T = any>(url: string, config?: RequestConfig) =>
    request<T>("DELETE", url, config?.data, config),
};

export default apiClient;
