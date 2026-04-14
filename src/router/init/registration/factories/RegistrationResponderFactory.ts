import { KairoRuntime } from "../../../types/KairoRuntime";
import { RegistrationResponder } from "../RegistrationResponder";

export class RegistrationResponderFactory {
    constructor() {}

    create(runtime: KairoRuntime): RegistrationResponder {
        return new RegistrationResponder(runtime);
    }
}
