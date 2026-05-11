import Ajv, { type ValidateFunction } from "ajv";

const ajv = new Ajv({
    validateSchema: false,
    allErrors: false,
    inlineRefs: false,
    strict: false,
    removeAdditional: false,
    coerceTypes: false,
    code: {
        optimize: false,
    },
});

export function compile<T>(schema: object): ValidateFunction<T> {
    return ajv.compile<T>(schema);
}
