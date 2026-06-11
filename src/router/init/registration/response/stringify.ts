import type { RegistrationResponse } from "./schema";

export const stringifyRegistrationResponse = (response: RegistrationResponse): string =>
    JSON.stringify(response);
