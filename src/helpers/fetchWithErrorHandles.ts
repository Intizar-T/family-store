export const fetchWithErrorHandler = async (
  url: string,
  options?: RequestInit
) => {
  try {
    const request = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!request.ok) throw new Error(await request.text());
    return request.json();
  } catch (error) {
    return "400";
  }
};
