export async function register() {
  // Simple error tracking hook: listen to unhandledrejection and error
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (e) => {
      try { navigator.sendBeacon?.(`${process.env.NEXT_PUBLIC_BASE_URL}/api/observability/error`, JSON.stringify({ message: e.message, stack: (e as any)?.error?.stack, href: location.href })); } catch {}
    });
    window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
      try { navigator.sendBeacon?.(`${process.env.NEXT_PUBLIC_BASE_URL}/api/observability/error`, JSON.stringify({ message: String(e.reason), href: location.href })); } catch {}
    });
  }
}
