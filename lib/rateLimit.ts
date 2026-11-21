/**
 * Memory-based sliding-window rate limiter for API endpoints.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);

  // Do not keep process alive in tests or CLI
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Seconds until reset
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = rateLimitStore.get(identifier);

  if (!existing || existing.resetAt <= now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: windowSeconds,
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    reset: Math.ceil((existing.resetAt - now) / 1000),
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
