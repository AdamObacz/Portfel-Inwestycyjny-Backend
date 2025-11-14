// Minimal CORS middleware stub for backend entry
// Use specific/safer types to avoid `any` diagnostics in the frontend toolchain.
export default function cors() {
  // Return a middleware-like function compatible with many frameworks
  return function (_req: unknown, _res: unknown, _next?: () => void) {
    // no-op stub — pass control to next if provided
    _next?.();
  };
}
