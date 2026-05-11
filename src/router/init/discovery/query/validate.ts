import { compile } from "@kairo-js/utils";
import { type DiscoveryQuery, DiscoveryQuerySchema } from "./schema";

export const validateDiscoveryQuery = compile<DiscoveryQuery>(DiscoveryQuerySchema);
