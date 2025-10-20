import express from 'express';
import createHttpError from 'http-errors';
import Restaurant from '../models/Restaurant.js';
import { cloudinary, uploadCloudinary } from '../middlewares/uploadCloudinary.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

// GET: lista ristoranti (pubblico, senza autenticazione)
router.get('/', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().sort({ name: 1 });
        res.send(restaurants);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

// GET: ristorante singolo (pubblico)
router.get('/:restaurantId', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return next(createHttpError.NotFound('Ristorante non trovato'));
        res.send(restaurant);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

// POST: crea ristorante (protetto da autenticazione)
router.post(
    '/',
    authentication, // <-- qui aggiungi il middleware
    uploadCloudinary.single('image'),
    async (req, res, next) => {
        try {
            const restaurantData = {
                ...req.body,
                owner: req.authUser._id, // associamo il ristorante all'utente loggato
                image: req.file
                    ? {
                          path: req.file.path,
                          filename: req.file.filename,
                      }
                    : null,
            };

            const newRestaurant = await Restaurant.create(restaurantData);
            res.send(newRestaurant);
        } catch (error) {
            next(createHttpError.InternalServerError(error));
        }
    }
);

// PATCH: modifica ristorante (protetto)
router.patch(
    '/:restaurantId',
    authentication, // <-- proteggi anche questa rotta
    uploadCloudinary.single('image'),
    async (req, res, next) => {
        try {
            // Per sicurezza, potresti verificare che req.authUser sia il proprietario
            const restaurant = await Restaurant.findById(req.params.restaurantId);
            if (!restaurant) return next(createHttpError.NotFound('Ristorante non trovato'));

            if (!restaurant.owner.equals(req.authUser._id)) {
                return next(createHttpError.Forbidden('Non autorizzato'));
            }

            const updateData = {
                ...req.body,
                image: req.file
                    ? {
                          path: req.file.path,
                          filename: req.file.filename,
                      }
                    : restaurant.image,
            };

            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                req.params.restaurantId,
                updateData,
                { new: true }
            );

            res.send(updatedRestaurant);
        } catch (error) {
            next(createHttpError.InternalServerError(error));
        }
    }
);

// DELETE: elimina ristorante (protetto)
router.delete(
    '/:restaurantId',
    authentication, // <-- anche qui serve
    async (req, res, next) => {
        try {
            const restaurant = await Restaurant.findById(req.params.restaurantId);
            if (!restaurant) return next(createHttpError.NotFound('Ristorante non trovato'));

            if (!restaurant.owner.equals(req.authUser._id)) {
                return next(createHttpError.Forbidden('Non autorizzato'));
            }

            await Restaurant.findByIdAndDelete(req.params.restaurantId);

            res.send({ message: 'Ristorante eliminato' });
        } catch (error) {
            next(createHttpError.InternalServerError(error));
        }
    }
);

export default router;
