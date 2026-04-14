import * as _sinclair_typebox from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';

declare enum SupportedTag {
    Official = "official",
    Approved = "approved",
    Stable = "stable",
    Experimental = "experimental"
}

interface AddonProperties {
    readonly id: string;
    readonly metadata?: AddonMetadata;
    readonly header: AddonHeader;
    readonly dependencies?: ManifestDependency[];
    readonly requiredAddons?: RequiredAddons;
    readonly tags?: SupportedTag[];
}
interface AddonMetadata {
    readonly authors?: string[];
    readonly url?: string;
    readonly license?: string;
}
interface AddonHeader {
    readonly name: string;
    readonly description: string;
    readonly version: SemVer;
    readonly min_engine_version: EngineVersion;
}
interface SemVer {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly prerelease?: string;
    readonly build?: string;
}
interface EngineVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}
interface ManifestDependency {
    readonly module_name: MinecraftModule;
    readonly version: string;
}
declare enum MinecraftModule {
    Server = "@minecraft/server",
    ServerUi = "@minecraft/server-ui",
    ServerGameTest = "@minecraft/server-gametest",
    ServerEditor = "@minecraft/server-editor",
    ServerEditorPrivateBindings = "@minecraft/server-editor-private-bindings",
    ServerNet = "@minecraft/server-net",
    ServerAdmin = "@minecraft/server-admin",
    DebugUtilities = "@minecraft/debug-utilities",
    Diagnostics = "@minecraft/diagnostics",
    ServerGraphics = "@minecraft/server-graphics"
}
interface RequiredAddons {
    readonly [addonId: string]: string;
}

interface KairoRegistry {
    kairoId: string;
    addonId: string;
    name: string;
    description: string;
    version: SemVer;
    metadata: {
        authors: string[];
        url?: string;
        license?: string;
    };
    requiredAddons: {
        [addonId: string]: string;
    };
    tags: SupportedTag[];
}

interface KairoContextMutator {
    setKairoId(value: string): void;
    setKairoRegistry(value: KairoRegistry): void;
}
declare class KairoContext {
    private readonly _properties;
    private _kairoId?;
    private _kairoRegistry?;
    private constructor(_properties: AddonProperties);
    get addonProperties(): AddonProperties;
    get kairoId(): string;
    applyKairoId(value: string, token: symbol): void;
    get kairoRegistry(): KairoRegistry;
    applyKairoRegistry(value: KairoRegistry, token: symbol): void;
    isRegistered(): boolean;
}

interface Disposable {
    dispose(): void;
}

interface KairoRuntime {
    currentTick(): number;
    send(id: string, message: string): void;
    subscribe(handler: (id: string, message: string) => void): Disposable;
}

declare const DiscoveryQuerySchema: _sinclair_typebox.TObject<{
    timestamp: _sinclair_typebox.TNumber;
    idNamespace: _sinclair_typebox.TString;
}>;
type DiscoveryQuery = Static<typeof DiscoveryQuerySchema>;

declare class DiscoveryQueryParser {
    private readonly runtime;
    private readonly TIMEOUT_TICKS;
    private constructor(runtime: KairoRuntime);
    parse(message: string): DiscoveryQuery;
    private parseJson;
}

declare class DiscoveryResponder {
    private readonly runtime;
    private constructor(runtime: KairoRuntime);
    respond(kairoId: string): void;
}

interface IdRegistry {
    has(id: string): boolean;
    register(id: string): void;
}

interface IdRegistryFactory {
    create(objectiveId: string): IdRegistry;
}

declare class KairoIdProvider {
    private readonly idRegistryFactory;
    private CHARSET;
    private PREFIX_LENGTH;
    private ID_LENGTH;
    private constructor(idRegistryFactory: IdRegistryFactory);
    provideId(properties: AddonProperties, query: DiscoveryQuery): string;
    private generateId;
    private hash;
}

declare class AddonDiscoveryManager implements Disposable {
    private readonly addonProperties;
    private readonly queryParser;
    private readonly idProvider;
    private readonly responder;
    private constructor(addonProperties: AddonProperties, queryParser: DiscoveryQueryParser, idProvider: KairoIdProvider, responder: DiscoveryResponder);
    resolveKairoId(message: string): string;
    handleRegistrationQuery(message: string): string;
    dispose(): void;
}

declare enum KairoInitEventId {
    DiscoveryQuery = "kairo:discovery_query",
    DiscoveryResponse = "kairo:discovery_response",
    RegistrationRequest = "kairo:registration_request",
    RegistrationResponse = "kairo:registration_response",
    RegistrationResult = "kairo:registration_result"
}

type Handler = (message: string) => void;
declare class KairoInitListener {
    private readonly runtime;
    private handlers;
    private constructor(runtime: KairoRuntime);
    setHandlers(handlers: Partial<Record<KairoInitEventId, Handler>>): void;
    setup(): Disposable;
    private onEvent;
    private isKairoInitEventId;
}

declare class KairoRegistryBuilder {
    build(kairoId: string, props: AddonProperties): KairoRegistry;
}

declare const RegistrationRequestSchema: _sinclair_typebox.TObject<{
    approvals: _sinclair_typebox.TArray<_sinclair_typebox.TString>;
    rejects: _sinclair_typebox.TArray<_sinclair_typebox.TString>;
    timestamp: _sinclair_typebox.TNumber;
}>;
type RegistrationRequest = Static<typeof RegistrationRequestSchema>;

declare class RegistrationRequestParser {
    private readonly runtime;
    private readonly TIMEOUT_TICKS;
    private constructor(runtime: KairoRuntime);
    parse(message: string): RegistrationRequest;
    private parseJson;
}

declare class RegistrationResponder {
    private readonly runtime;
    private constructor(runtime: KairoRuntime);
    respond(kairoRegistry: KairoRegistry): void;
}

declare class AddonRegistrationManager {
    private readonly parser;
    private readonly builder;
    private readonly responder;
    private constructor(parser: RegistrationRequestParser, builder: KairoRegistryBuilder, responder: RegistrationResponder);
    resolveRegistry(message: string, kairoId: string, addonProperties: AddonProperties): KairoRegistry | undefined;
    handleRegistrationResult(message: string): void;
    dispose(): void;
}

declare class KairoInitializer implements Disposable {
    private readonly context;
    private readonly contextMutator;
    private readonly initListener;
    private readonly discoveryManager;
    private readonly discoveryResponder;
    private readonly registrationManager;
    private readonly registrationResponder;
    private subscription?;
    private constructor(context: KairoContext, contextMutator: KairoContextMutator, initListener: KairoInitListener, discoveryManager: AddonDiscoveryManager, discoveryResponder: DiscoveryResponder, registrationManager: AddonRegistrationManager, registrationResponder: RegistrationResponder);
    setup(): void;
    dispose(): void;
}

type InitializerFactory = (context: KairoContext, mutator: KairoContextMutator) => KairoInitializer;
declare class KairoRouter {
    private readonly createInitializer;
    private _context?;
    private initializer;
    private constructor(createInitializer: InitializerFactory);
    init(properties: AddonProperties): void;
    get context(): KairoContext;
}

declare const router: KairoRouter;

export { type AddonHeader, type AddonMetadata, type AddonProperties, type EngineVersion, KairoRouter, type ManifestDependency, MinecraftModule, type RequiredAddons, type SemVer, SupportedTag, router };
