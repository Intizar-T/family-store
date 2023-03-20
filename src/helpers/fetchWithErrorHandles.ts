export const fetchWithErrorHandler = async <Data = any>(
  url: string,
  type: "text" | "json" | "blob",
  options?: RequestInit
): Promise<Data> => {
  const request = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!request.ok) throw new Error(await request.text());
  console.log(request);
  return request[type]();
};
