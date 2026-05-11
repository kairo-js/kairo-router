import Ajv, { type ValidateFunction } from "ajv";

const ajv = new Ajv({
    validateSchema: false,
    strict: true,
    allErrors: false,
    inlineRefs: false,
    removeAdditional: false,
    coerceTypes: false,
    useDefaults: false,
    code: {
        optimize: false,
    },
});

export function compile<T>(schema: object): ValidateFunction<T> {
    return ajv.compile<T>(schema);
}
