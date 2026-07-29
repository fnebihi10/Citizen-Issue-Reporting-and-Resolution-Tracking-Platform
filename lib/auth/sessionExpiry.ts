export const SESSION_MAX_AGE_MS = 60 * 60 * 1000;

export function getSessionExpiryTime(
  signedInAt: string | null | undefined,
  maxAgeMs = SESSION_MAX_AGE_MS,
) {
  if (!signedInAt) return null;
  const startedAt = new Date(signedInAt).getTime();
  if (!Number.isFinite(startedAt)) return null;
  return startedAt + maxAgeMs;
}

export function isSessionExpired(
  signedInAt: string | null | undefined,
  nowMs = Date.now(),
  maxAgeMs = SESSION_MAX_AGE_MS,
) {
  const expiresAt = getSessionExpiryTime(signedInAt, maxAgeMs);
  return expiresAt === null || nowMs >= expiresAt;
}

export function getSessionRemainingMs(
  signedInAt: string | null | undefined,
  nowMs = Date.now(),
  maxAgeMs = SESSION_MAX_AGE_MS,
) {
  const expiresAt = getSessionExpiryTime(signedInAt, maxAgeMs);
  return expiresAt === null ? 0 : Math.max(0, expiresAt - nowMs);
}
