export interface RegistrationRequest {
    readonly approvals: string[];
    readonly rejects: string[];
    readonly timestamp: number;
}
