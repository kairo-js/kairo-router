import { RegistrationResponder } from "../init/registration/RegistrationResponder";
import { KairoRuntime } from "../types/KairoRuntime";

export class RegistrationResponderFactory {
    constructor(private readonly runtime: KairoRuntime) {}

    create(): RegistrationResponder {
        return new RegistrationResponder(this.runtime);
    }
}
