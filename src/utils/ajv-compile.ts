import Ajv, { type ValidateFunction } from "ajv";

const ajvOptions = {
    allErrors: false,
    inlineRefs: false,
    strict: false,
    removeAdditional: false,
    coerceTypes: false,
    code: {
        optimize: false,
    },
};

let ajv: Ajv | undefined;

function getAjv(): Ajv {
    ajv ??= new Ajv(ajvOptions);
    return ajv;
}

export function compile<T>(schema: object): ValidateFunction<T> {
    let validate: ValidateFunction<T> | undefined;

    const lazyValidate = ((data: unknown) => {
        validate ??= getAjv().compile<T>(schema);
        const valid = validate(data);
        lazyValidate.errors = validate.errors;
        return valid;
    }) as ValidateFunction<T>;

    lazyValidate.errors = null;

    return lazyValidate;
}
