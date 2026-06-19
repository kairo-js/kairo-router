export enum KairoInitEventId {
    DiscoveryQuery = "kairo:discovery_query",
    DiscoveryResponse = "kairo:discovery_response",
    RegistrationRequest = "kairo:registration_request",
    RegistrationResponse = "kairo:registration_response",
    RegistrationResult = "kairo:registration_result",
    OrderPing = "kairo:order-ping",
    OrderPong = "kairo:order-pong",
    CommandManifestRequest = "kairo:cmd-manifest-req",
    CommandManifest = "kairo:cmd-manifest",
    CommandDelegatableUpdate = "kairo:cmd-delegatable",
    ApiManifest = "kairo:api_manifest",
}
