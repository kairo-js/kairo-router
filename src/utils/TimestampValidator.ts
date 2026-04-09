export class TimestampValidator {
    static isFuture(currentTick: number, timestamp: number): boolean {
        return timestamp > currentTick;
    }

    static isExpired(currentTick: number, timestamp: number, timeout: number): boolean {
        return currentTick - timestamp > timeout;
    }

    static isValid(currentTick: number, timestamp: number, timeout: number): boolean {
        return (
            !this.isFuture(currentTick, timestamp) &&
            !this.isExpired(currentTick, timestamp, timeout)
        );
    }
}
