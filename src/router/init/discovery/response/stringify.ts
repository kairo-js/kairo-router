import type { DiscoveryResponse } from "./schema";

export const stringifyDiscoveryResponse = (response: DiscoveryResponse): string =>
    JSON.stringify(response);
