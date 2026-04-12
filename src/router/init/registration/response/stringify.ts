import fastJson, { Schema } from "fast-json-stringify";
import { registrationResponseSchema } from "./schema";
import { RegistrationResponse } from "./types";

export const stringifyRegistrationResponse: (response: RegistrationResponse) => string = fastJson(
    registrationResponseSchema as unknown as Schema,
);
