import Ajv, { ValidateFunction } from "ajv";

const ajv = new Ajv();

export function compile<T>(schema: object): ValidateFunction<T> {
    return ajv.compile<T>(schema);
}
