export function validateTimestamp(
    currentTick: number,
    timestamp: number,
    timeout: number,
    onTimeout: () => Error,
    onFuture: () => Error,
) {
    if (timestamp > currentTick) {
        throw onFuture();
    }

    if (currentTick - timestamp > timeout) {
        throw onTimeout();
    }
}
