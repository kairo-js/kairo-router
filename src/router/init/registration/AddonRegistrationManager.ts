import { KairoInitializer } from "../KairoInitializer";
import { RegistrationDataBuilder } from "./RegistrationDataBuilder";
import { RegistrationRequestListener } from "./RegistrationRequestListener";
import { RegistrationResponder } from "./RegistrationResponder";
import { RegistrationResultListener } from "./RegistrationResultListener";

// kjs-router-ch 0201
export class AddonRegistrationManager {
    private readonly requestListener = new RegistrationRequestListener(this);
    private readonly dataBuilder = new RegistrationDataBuilder(this);
    private readonly responder = new RegistrationResponder(this);
    private readonly resultListener = new RegistrationResultListener(this);
    public constructor(private readonly kairoInitializer: KairoInitializer) {}

    public setup(): void {
        this.requestListener.setup();
        this.resultListener.setup();
    }

    public handleRegistrationRequest(message: string): void {}

    public handleRegistrationResult(message: string): void {}
}
