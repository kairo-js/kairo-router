import { compile } from "../../../../utils/ajv";
import { discoveryQuerySchema } from "./schema";
import { DiscoveryQuery } from "./types";

export const validateDiscoveryQuery = compile<DiscoveryQuery>(discoveryQuerySchema);
