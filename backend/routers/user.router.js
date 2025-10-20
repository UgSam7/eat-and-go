import express from 'express';
import createHttpError from 'http-errors';
import { htmlToText } from 'html-to-text';

import User from '../models/User.js';
import {
    cloudinary,
    uploadCloudinary,
} from '../middlewares/uploadCloudinary.js';

const router = express.Router();

router.get('/', async (request, response, next) => {
    try {
        const searchTerm = request.query.search;

        let queryObj;
        if (searchTerm) {
            queryObj = {
                firstName: new RegExp(searchTerm, 'i'),
            };
        } else {
            queryObj = {};
        }

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
        console.log(error);
    }

    // qui potete fare cose dopo aver risposto
});

router.get('/:userId', async (request, response, next) => {
    const userId = '' + request.params.userId;

    try {
        const user = await User.findById(userId);

        if (user) response.send(user);
        else throw new Error();
    } catch (error) {
        // response.status(404).send({ message: 'not found' });
        // next({ status: 404 });
        next(createHttpError.NotFound('Non trovato'));
    }
});

router.post(
    '/',
    uploadCloudinary.single('profile'),
    async (request, response, next) => {
        try {
            const userData = {
                ...request.body,
                profile: request.file
                    ? {
                          path: request.file.path,
                          filename: request.file.filename,
                      }
                    : null,
            };

            const insertedUser = await User.create(userData);

            response.send(insertedUser);
        } catch (error) {
            console.log(error);
            next(createHttpError.InternalServerError(error));
        }
    }
);

router.patch(
    '/:userId/profile',
    uploadCloudinary.single('profile'), // l'immagine è già caricata
    async (request, response, next) => {
        // console.log(request.file);
        // esempio di oggetto request.file:
        // {
        //     fieldname: 'profile',
        //     originalname: 'picsum1.jpg',
        //     encoding: '7bit',
        //     mimetype: 'image/jpeg',
        //     path: 'https://res.cloudinary.com/dgfzgwdwa/image/upload/v1757018705/epicode2025/fcfwrt2xpbgatu0zhneh.jpg',
        //     size: 16138,
        //     filename: 'epicode2025/fcfwrt2xpbgatu0zhneh'
        // }

        const userId = request.params.userId;

        const originalUser = await User.findById(userId);
        const filename = originalUser?.profile?.filename;

        // ci assicuriamo di aver aggiornato il database
        // prima di eliminare la vecchia immagine
        let user;
        try {
            user = await User.findByIdAndUpdate(
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
        } catch (error) {
            console.log(error);
            return next(createHttpError.InternalServerError(error));
        }

        // eliminazione vecchia immagine se presente
        try {
            if (originalUser.profile) {
                await cloudinary.uploader.destroy(
                    originalUser.profile.filename,
                    {
                        invalidate: true,
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }

        response.send(user);

        try {
            const htmlContent = `
                <h1>Hai cambiato la tua immagine di profilo</h1>
                Info:
                <ul>
                    <li>firstname: ${user.firstName}</li>
                    <li>lastname: ${user.lastName}</li>
                    <li>email: ${user.email}</li>
                </ul>
            `;

            await mailer.sendMail({
                from: {
                    name: 'Epizafferano',
                    address: 'admin@epizafferano.com',
                },
                to: user.email,
                subject: 'Cambio immagine profilo',
                text: htmlToText(htmlContent),
                html: htmlContent,
            });
        } catch (error) {
            console.log(error);
        }
    }
);

router.put('/:userId', async (request, response) => {
    const userId = request.params.userId;
    const userData = request.body;

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });

    response.send(user);
});

router.delete('/:userId', async (request, response) => {
    const userId = request.params.userId;

    const user = await User.findByIdAndDelete(userId);

    response.send({ message: 'user deleted' });
});

export default router;
