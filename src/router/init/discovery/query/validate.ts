import { compile } from "../../../../utils/ajv-compile";
import { discoveryQuerySchema } from "./schema";
import { DiscoveryQuery } from "./types";

export const validateDiscoveryQuery = compile<DiscoveryQuery>(discoveryQuerySchema);
