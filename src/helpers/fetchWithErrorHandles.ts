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
  // console.log(await request.json());
  if (!request.ok) throw new Error(await request.text());
  return request.json();
};
