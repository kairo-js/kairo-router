import type { ApiCall, ApiHandlerResponse } from "./schema";

export const stringifyApiCall = (call: ApiCall): string =>
    JSON.stringify(call);

export const stringifyApiHandlerResponse = (response: ApiHandlerResponse): string =>
    JSON.stringify(response);
