import createHttpError from "http-errors";

const normalize = (email) => email?.trim().toLowerCase();

// Ruolo previsto dalle variabili d'ambiente per una email.
export function roleForEmail(email) {
  const e = normalize(email);
  if (!e) return "user";

  if (e === normalize(process.env.SUPER_ADMIN_EMAIL)) return "superadmin";

  const admins = process.env.ADMIN_EMAILS?.split(",").map(normalize) || [];
  return admins.includes(e) ? "admin" : "user";
}

export function isAdmin(user) {
  if (!user) return false;
  if (user.role === "superadmin" || user.role === "admin") return true;

  // Le email in env contano solo per utenti Google (email verificata da Google).
  // Chi si registra a mano può digitare qualsiasi email, quindi non è affidabile.
  return Boolean(user.googleId) && roleForEmail(user.email) !== "user";
}

// Da usare dopo `authentication`.
export function requireAdmin(req, res, next) {
  if (!isAdmin(req.user)) {
    return next(createHttpError.Forbidden("Accesso negato: non sei admin"));
  }
  next();
}

// Permette l'accesso all'utente stesso (`:userId`) oppure a un admin.
export function requireSelfOrAdmin(req, res, next) {
  if (isAdmin(req.user) || String(req.user?._id) === req.params.userId) {
    return next();
  }
  next(createHttpError.Forbidden("Accesso negato"));
}
