// Minimal CORS middleware stub for backend entry
export default function cors(options: any) {
  // Return a middleware-like function compatible with many frameworks
  return function (_req: any, _res: any, _next: any) {
    // no-op stub
    return _next?.();
  };
}
