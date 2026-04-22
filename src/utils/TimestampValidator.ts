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

export function validateTimestamp(
    currentTick: number,
    timestamp: number,
    timeout: number,
    onTimeout: () => Error,
    onFuture: () => Error,
) {
    if (TimestampValidator.isExpired(currentTick, timestamp, timeout)) {
        throw onTimeout();
    }

    if (TimestampValidator.isFuture(currentTick, timestamp)) {
        throw onFuture();
    }
}
