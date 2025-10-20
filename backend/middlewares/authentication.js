import createHttpError from 'http-errors';
import { verifyJWT } from '../helpers/jwt.js';
import User from '../models/User.js';

async function authentication(request, response, next) {
    // Controlla che ci sia l'header Authorization
    if (!request.headers.authorization)
        return next(createHttpError.Unauthorized('Token mancante'));

    const parts = request.headers.authorization.split(' ');

    // Deve essere formato da due parti: "Bearer <token>"
    if (parts.length !== 2 || parts[0] !== 'Bearer')
        return next(createHttpError.Unauthorized('Formato token non valido'));

    const jwtToken = parts[1];

    try {
        // Verifica e decodifica il token JWT
        const payload = await verifyJWT(jwtToken);

        // Recupera l'utente dal DB usando userId del payload
        const authUser = await User.findById(payload.userId);

        if (!authUser) throw new Error('Utente non trovato');

        // Salva l'utente nella request per usarlo nelle route protette
        request.authUser = authUser;

        // Procedi alla prossima funzione middleware/route
        next();
    } catch (error) {
        // Token non valido o errore nel DB -> rispondi con 401
        next(createHttpError.Unauthorized('Token non valido o utente non trovato'));
    }
}

export default authentication;
