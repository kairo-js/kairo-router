import { JSONSchemaType } from "ajv";
import { RegistrationResponse } from "./types";

export const registrationResponseSchema: JSONSchemaType<RegistrationResponse> = {
    type: "object",
    properties: {
        addonData: {
            type: "object",
            properties: {
                kairoId: { type: "string" },
                addonId: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                version: {
                    type: "object",
                    properties: {
                        major: { type: "number" },
                        minor: { type: "number" },
                        patch: { type: "number" },
                        prerelease: { type: "string", nullable: true },
                        build: { type: "string", nullable: true },
                    },
                    required: ["major", "minor", "patch"],
                    additionalProperties: false,
                },
                metadata: {
                    type: "object",
                    properties: {
                        authors: {
                            type: "array",
                            items: { type: "string" },
                        },
                        url: { type: "string", nullable: true },
                        license: { type: "string", nullable: true },
                    },
                    required: ["authors"],
                    additionalProperties: false,
                },

                requiredAddons: {
                    type: "object",
                    additionalProperties: { type: "string" },
                } as any,

                tags: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: ["official", "approved", "stable", "experimental"],
                    },
                },
            },
            required: [
                "kairoId",
                "addonId",
                "name",
                "description",
                "version",
                "metadata",
                "requiredAddons",
                "tags",
            ],
            additionalProperties: false,
        },

        timestamp: { type: "number" },
    },
    required: ["addonData", "timestamp"],
    additionalProperties: false,
};
