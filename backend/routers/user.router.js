import express from 'express';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import authentication from '../middlewares/authentication.js';
import {
    requireAdmin,
    requireSelfOrAdmin,
} from '../middlewares/authorization.js';
import { escapeRegex } from '../helpers/regex.js';
import {
    cloudinary,
    uploadCloudinary,
} from '../middlewares/uploadCloudinary.js';

const router = express.Router();

// Tutte le rotte utenti richiedono autenticazione.
router.use(authentication);

// Elenco utenti: solo admin
router.get('/', requireAdmin, async (request, response, next) => {
    try {
        const searchTerm = request.query.search;

        const queryObj = searchTerm
            ? { firstName: new RegExp(escapeRegex(searchTerm), 'i') }
            : {};

        let page = parseInt(request.query.page) || 1;
        if (page < 1) page = 1;

        let perPage = parseInt(request.query.perPage) || 3;
        if (perPage < 1 || perPage > 25) perPage = 3;

        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);

        const users = await User.find(queryObj)
            .sort({ firstName: 1, lastName: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        response.send({
            page,
            perPage,
            totalPages,
            totalCount,
            data: users,
        });
    } catch (error) {
        next(error);
    }
});

// Dettaglio utente: l'utente stesso oppure un admin
router.get('/:userId', requireSelfOrAdmin, async (request, response, next) => {
    try {
        const user = await User.findById(request.params.userId);

        if (user) response.send(user);
        else throw new Error();
    } catch (error) {
        next(createHttpError.NotFound('Non trovato'));
    }
});

// Cambio immagine profilo: l'utente stesso oppure un admin
router.patch(
    '/:userId/profile',
    requireSelfOrAdmin, // prima del controllo, per non caricare file su Cloudinary a vuoto
    uploadCloudinary.single('profile'),
    async (request, response, next) => {
        try {
            const userId = request.params.userId;

            const originalUser = await User.findById(userId);
            if (!originalUser) {
                return next(createHttpError.NotFound('Non trovato'));
            }

            // aggiorniamo il database prima di eliminare la vecchia immagine
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    profile: request.file
                        ? {
                              path: request.file.path,
                              filename: request.file.filename,
                          }
                        : null,
                },
                { new: true }
            );

            // eliminazione vecchia immagine (solo se caricata da noi su Cloudinary)
            try {
                if (originalUser.profile?.filename) {
                    await cloudinary.uploader.destroy(
                        originalUser.profile.filename,
                        { invalidate: true }
                    );
                }
            } catch (error) {
                console.error('Errore eliminazione vecchia immagine:', error.message);
            }

            response.send(user);
        } catch (error) {
            next(createHttpError.InternalServerError(error));
        }
    }
);

// Modifica dati: solo campi consentiti (mai `role`, `password`, `googleId`)
router.put('/:userId', requireSelfOrAdmin, async (request, response, next) => {
    try {
        const { firstName, lastName, email } = request.body;
        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (email !== undefined) updates.email = String(email).toLowerCase();

        const user = await User.findByIdAndUpdate(
            request.params.userId,
            updates,
            { new: true, runValidators: true }
        );
        if (!user) return next(createHttpError.NotFound('Non trovato'));

        response.send(user);
    } catch (error) {
        next(error);
    }
});

// Eliminazione utente: solo admin
router.delete('/:userId', requireAdmin, async (request, response, next) => {
    try {
        const user = await User.findByIdAndDelete(request.params.userId);
        if (!user) return next(createHttpError.NotFound('Non trovato'));

        response.send({ message: 'user deleted' });
    } catch (error) {
        next(error);
    }
});

export default router;
