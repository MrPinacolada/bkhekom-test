import { serializeObject } from "@/utils/helpers/serializeObject";

interface ApiFunctionArgs {
  url: string;
  query?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, any>;
}

export const apiGet = async ({ url, query, headers }: ApiFunctionArgs) => {
  try {
    let queryString = "";
    if (query) {
      queryString = serializeObject(query);
    }

    const response = await fetch(url + (queryString ? `?${queryString}` : ""), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    return response;
  } catch (error: any) {
    console.error(error);
  }
};
