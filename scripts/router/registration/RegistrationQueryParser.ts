import { RegistrationManager } from "./RegistrationManager";
import { RegistrationQuery } from "./RegistrationQuery";

export class RegistrationQueryParser {
    public constructor(manager: RegistrationManager) {}

    public parse(message: string): RegistrationQuery {}
}
