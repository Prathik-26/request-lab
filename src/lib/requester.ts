export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export async function sendRequest(
  url: string,
  method: string,
  headers: { key: string; value: string; enabled: boolean }[],
  body: string,
): Promise<ResponseData> {
  const start = performance.now();

  const headerObj: Record<string, string> = {};
  headers
    .filter((h) => h.enabled && h.key)
    .forEach((h) => {
      headerObj[h.key] = h.value;
    });

  const options: RequestInit = {
    method,
    headers: headerObj,
  };

  if (!["GET", "DELETE"].includes(method) && body) {
    options.body = body;
  }

  const res = await fetch(url, options);
  const time = Math.round(performance.now() - start);
  const text = await res.text();
  const size = new Blob([text]).size;

  const resHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    resHeaders[key] = value;
  });

  return {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
    body: text,
    time,
    size,
  };
}
