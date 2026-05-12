import { compile } from "@kairo-js/utils";
import { DiscoveryQuerySchema } from "./schema";

export const validateDiscoveryQuery = compile(DiscoveryQuerySchema);
