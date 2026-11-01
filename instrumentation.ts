/** Runs once when the Node.js server process starts (Next's instrumentation
 * hook). Works around a connectivity issue specific to this app's Docker
 * setup: Node 20's default "Happy Eyeballs" behavior races every resolved
 * address (IPv4 and IPv6) for a host in parallel, and on this Docker
 * network the synthesized IPv6 (NAT64) addresses some hosts advertise
 * (e.g. Cloudinary's API) are unreachable in a way that stalls the whole
 * race instead of failing fast — so even the reachable IPv4 addresses time
 * out, even though connecting to one of them directly, alone, works fine.
 * Preferring IPv4 in DNS results and disabling the parallel race (so Node
 * falls back to its older "try the first resolved address" behavior)
 * avoids that race entirely. Harmless outside this specific environment —
 * neither setting changes behavior when IPv6 connectivity is actually
 * fine. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const dns = await import("node:dns");
  dns.setDefaultResultOrder("ipv4first");

  const net = await import("node:net");
  net.setDefaultAutoSelectFamily?.(false);
}
