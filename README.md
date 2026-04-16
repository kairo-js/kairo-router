# Kairo-router

## Development

This project uses **pnpm** as the package manager.

- Required pnpm version: `10.31.0`
- Install dependencies: `pnpm install`
- Build: `pnpm run build`

The build pipeline uses `tsup` to bundle JavaScript (ESM) and emit type declarations, then runs `.build/postprocess-dts.js` to post-process the generated `lib/index.d.ts`.
