import Ajv, { ValidateFunction } from "ajv";

const ajv = new Ajv({
    allErrors: true,
    strict: true,
    removeAdditional: false,
    coerceTypes: false,
});

export function compile<T>(schema: object): ValidateFunction<T> {
    return ajv.compile<T>(schema);
}
