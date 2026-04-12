import { JSONSchemaType } from "ajv";
import { RegistrationRequest } from "./types";

export const registrationRequestSchema: JSONSchemaType<RegistrationRequest> = {
    type: "object",
    properties: {
        approvals: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 0,
        },
        rejects: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 0,
        },
        timestamp: {
            type: "number",
        },
    },
    required: ["approvals", "rejects", "timestamp"],
    additionalProperties: false,
};
