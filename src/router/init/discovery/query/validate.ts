import { compile } from "../../../../utils/ajv-compile";
import { DiscoveryQuery, DiscoveryQuerySchema } from "./schema";

export const validateDiscoveryQuery = compile<DiscoveryQuery>(DiscoveryQuerySchema);
