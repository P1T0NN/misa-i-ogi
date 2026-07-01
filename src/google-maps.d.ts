// The generated `.svelte-kit/tsconfig.json` pins `"types": ["node"]`, which stops TS from
// auto-including other `@types/*` packages. This reference force-loads the ambient `google.maps`
// namespace project-wide so `src/shared/lib/google-maps/*` can use `google.*` types.
/// <reference types="google.maps" />
