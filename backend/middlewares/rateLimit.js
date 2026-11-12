import createHttpError from "http-errors";

// Rate limiter in memoria, per IP. Sufficiente per una singola istanza.
// Richiede `server.set("trust proxy", 1)` dietro a Render/Vercel.
export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);

    if (!entry || entry.resetAt <= now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      return next(createHttpError(429, "Troppe richieste, riprova più tardi"));
    }
    next();
  };
}
