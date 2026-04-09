import { JSONSchemaType } from "ajv";
import { RegistrationRequest } from "./types";

export const registrationRequestSchema: JSONSchemaType<RegistrationRequest> = {
    type: "object",
    properties: {
        approvalAddonIds: {
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
    required: ["approvalAddonIds", "timestamp"],
    additionalProperties: false,
};
