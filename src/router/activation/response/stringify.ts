import type { ActivationResponse } from "./schema";

export const stringifyActivationResponse = (response: ActivationResponse): string =>
    JSON.stringify(response);
