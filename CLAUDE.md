# Eat&Go

Sito dove gli utenti propongono ristoranti economici per la pausa pranzo; un admin li approva prima della pubblicazione. UI e testi in italiano.

## Struttura
- `backend/` Node (ESM) + Express 5 + MongoDB (Mongoose). Entry: `server.js`.
- `frontend/` React 19 + Vite + React-Bootstrap + React Router 7. Deploy Vercel (frontend), Render (backend).
- Root `package.json`: `npm run dev` avvia backend (nodemon) e frontend insieme (concurrently).
- `.gitignore` nella root ignora `node_modules`, `.env*` (tranne `.env.example`), `dist`, log e `.DS_Store`. Backend e frontend hanno ciascuno le proprie dipendenze dichiarate (`npm ci` in ognuno); il `node_modules` della root serve solo a `concurrently` per `npm run dev`.

## Backend
- Rotte: `/api/auth` (register, login, me, login-google, google/callback), `/api/restaurants`, `/api/contact`, `/api/v1/users`.
- Auth: JWT 7gg (`helpers/jwt.js`), middleware `middlewares/authentication.js` (Bearer, carica `req.user`). Google OAuth con Passport (`config/passport.config.js`).
- Ruoli `user|admin|superadmin`. `register` crea sempre `user`; i ruoli da `SUPER_ADMIN_EMAIL` / `ADMIN_EMAILS` (virgole) si assegnano solo al login Google (email verificata, `passport.config.js`, solo promozioni). `isAdmin` accetta ruolo DB admin/superadmin, oppure email env solo se l'utente ha `googleId`.
- Upload immagini: `middlewares/uploadCloudinary.js` (multer + Cloudinary, cartella `EatAndGo`).
- Modelli: `User`, `Restaurant` (`approved` false di default; `priceRange` enum `10-15|15-20|20-30|30+` piu' `20+` legacy; `cuisineType` enum con default `Altro`, il form usa una select con gli stessi valori).
- Email contatti via Resend (`routers/contact.router.js`).
- Env: vedi `backend/.env.example`. CORS ammette `localhost:5173` e il dominio Vercel (hardcoded in `server.js`).

## Frontend
- `VITE_API_URL` = base del backend. `context/AuthContext.jsx` espone `user, login(token), logout, loading, axios` (istanza con Bearer automatico); token in `localStorage`.
- Pagine in `src/pages`, componenti in `src/components`, stili in `src/styles/global.css`.
- Rotte: `/`, `/login`, `/register`, `/profile`, `/restaurants`, `/restaurants/:id`, `/add-restaurant`, `/admin/restaurants`, `/contact`, `/privacy`, `/terms`.
- Sidebar: regioni/citta' scritte a mano in `MySidebar.jsx` (solo Piemonte: Torino, Asti).
- Dopo login Google il backend reindirizza a `/login?token=...`.

## Comandi
- Tutto: `npm run dev` (root). Backend: `cd backend && npm run dev`. Frontend: `cd frontend && npm run dev`, `npm run build`, `npm run lint`.
- Non ci sono test.

## Problemi noti (aggiornare man mano che si risolvono)
Dipendenze:
- Le pagine usano `axios` diretto con `VITE_API_URL` invece dell'istanza di `AuthContext` (duplicazione, token letto a mano da `localStorage`).
- Lint frontend (`npm run lint`): 1 errore (`AuthContext.jsx` esporta provider e hook `useAuth` insieme, react-refresh) e 1 warning (`RestaurantList.jsx`, deps di `useEffect`). Build ok.
- I pacchetti root (`axios`, `bcrypt`, `resend`...) duplicano quelli di backend/frontend: il `package.json` root dovrebbe avere solo `concurrently`.
Sicurezza (residuo; il resto e' stato sistemato, vedi sezione sotto):
- Il JWT resta in `localStorage` (esposto a XSS), dura 1 giorno, senza revoca esplicita (il middleware ricarica l'utente dal DB a ogni richiesta, quindi utenti eliminati o declassati perdono subito l'accesso). Spostarlo in cookie httpOnly richiederebbe SameSite=None + CSRF (frontend e backend su domini diversi): rimandato.
- Un account creato a mano con l'email di un admin blocca il login Google di quell'admin (email duplicata, `unique`).
- Rate limiter in memoria (per istanza, si azzera al riavvio).
Repo:
- README vuoti; la cronologia git contiene ancora `node_modules` (`.git` ~168 MB), ripulirla richiederebbe `git filter-repo` + force push (non fatto); il `proxy` in `vite.config.js` (punta a Render) e' inutilizzato perche' le chiamate usano `VITE_API_URL` assoluto.

## Sicurezza: com'e' fatta ora
- `middlewares/authorization.js`: `isAdmin`, `requireAdmin`, `requireSelfOrAdmin`. Tutte le rotte `/api/v1/users` richiedono login; lista/elimina solo admin; GET/PUT/PATCH sull'utente stesso o admin. `PUT` accetta solo `firstName/lastName/email` (mai `role`). La `POST` utenti e' stata rimossa (c'e' `/api/auth/register`).
- `helpers/regex.js` `escapeRegex` per ogni `new RegExp(input)`.
- `middlewares/rateLimit.js`: login 10/15min, register 10/ora, contatti 5/15min (per IP; `trust proxy` attivo in `server.js`).
- Dopo login Google il token arriva in `FRONTEND_HOST/login#token=...` (fragment, non query). `Login.jsx` legge `location.hash`.
- Nessun log di token, header Authorization o profilo Google. Destinatario del form contatti da env `CONTACT_TO_EMAIL`, con ripiego su `CONTACT_EMAIL` (su Render esiste solo `CONTACT_EMAIL`). Mittente da `CONTACT_FROM_EMAIL` (dominio verificato su Resend); senza, usa `onboarding@resend.dev` che consegna solo al proprietario dell'account Resend. `replyTo` e' l'email di chi scrive.
