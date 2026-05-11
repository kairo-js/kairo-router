import { compile } from "../../../../utils/ajv-compile";
import { type DiscoveryQuery, DiscoveryQuerySchema } from "./schema";

export const validateDiscoveryQuery = compile<DiscoveryQuery>(DiscoveryQuerySchema);
