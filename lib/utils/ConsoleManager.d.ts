import { KairoAddonProperties } from "../constants/properties";
export declare enum ConsoleTimeFormat {
    TimeOnly = "time",
    DateTime = "datetime",
    None = "none"
}
export declare class ConsoleManager {
    private static readonly JST_OFFSET_MS;
    private static properties;
    static init(properties: KairoAddonProperties): void;
    private static requireInitialized;
    private static getJstDate;
    private static pad;
    private static formatTime;
    private static buildPrefix;
    static log(message: string, timeFormat?: ConsoleTimeFormat): void;
    static warn(message: string, timeFormat?: ConsoleTimeFormat): void;
    static error(message: string, timeFormat?: ConsoleTimeFormat): void;
}
