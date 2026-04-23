export type TaskDefinition = {
    type: "interval" | "timeout";
    callback: () => void;
    tick?: number;

    runtimeId?: number;
    disposed?: boolean;

    finished?: boolean;
};
