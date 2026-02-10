import { KairoAddonProperties, SemVer } from "../constants/properties";
import { Kairo } from "./Kairo";
import { KairoUtils } from "../utils/KairoUtils";

export interface AddonProperty {
  id: string;
  name: string;
  description: string;
  sessionId: string;
  version: SemVer;
  dependencies: {
    module_name: string;
    version: string;
  }[];
  requiredAddons: {
    [name: string]: string;
  };
  tags: string[];
}

export class AddonPropertyManager {
  private self: AddonProperty;
  private readonly charset = [
    ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ];

  private constructor(
    private readonly kairo: Kairo,
    properties: KairoAddonProperties,
  ) {
    this.self = {
      id: properties.id,
      name: properties.header.name,
      description: properties.header.description,
      sessionId: KairoUtils.generateRandomId(8),
      version: properties.header.version,
      dependencies: properties.dependencies ?? [],
      requiredAddons: properties.requiredAddons ?? {},
      tags: properties.tags ?? [],
    };
  }

  public static create(
    kairo: Kairo,
    properties: KairoAddonProperties,
  ): AddonPropertyManager {
    return new AddonPropertyManager(kairo, properties);
  }

  public getSelfAddonProperty(): AddonProperty {
    return this.self;
  }

  public refreshSessionId(): void {
    this.self.sessionId = KairoUtils.generateRandomId(8);
  }
}
